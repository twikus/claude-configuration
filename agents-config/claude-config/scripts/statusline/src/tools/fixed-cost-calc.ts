#!/usr/bin/env bun
/**
 * Fixed cost calculator - uses last chunk per message (fixes ccusage bug)
 * Usage: bun run src/tools/fixed-cost-calc.ts [YYYY-MM-DD]
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// Pricing per million tokens
const PRICING: Record<
	string,
	{ input: number; output: number; cacheCreate: number; cacheRead: number }
> = {
	"claude-sonnet-4-20250514": {
		input: 3,
		output: 15,
		cacheCreate: 3.75,
		cacheRead: 0.3,
	},
	"claude-opus-4-20250514": {
		input: 15,
		output: 75,
		cacheCreate: 18.75,
		cacheRead: 1.5,
	},
	"claude-opus-4-5-20251101": {
		input: 5,
		output: 25,
		cacheCreate: 6.25,
		cacheRead: 0.5,
	},
	"claude-haiku-4-5-20251001": {
		input: 1,
		output: 5,
		cacheCreate: 1.25,
		cacheRead: 0.1,
	},
	"claude-3-5-sonnet-20241022": {
		input: 3,
		output: 15,
		cacheCreate: 3.75,
		cacheRead: 0.3,
	},
};

const DEFAULT_PRICING = {
	input: 3,
	output: 15,
	cacheCreate: 3.75,
	cacheRead: 0.3,
};

interface UsageData {
	input_tokens?: number;
	output_tokens?: number;
	cache_creation_input_tokens?: number;
	cache_read_input_tokens?: number;
}

interface MessageEntry {
	timestamp: string;
	type: string;
	message?: {
		id?: string;
		model?: string;
		usage?: UsageData;
	};
	requestId?: string;
}

function findJsonlFiles(dir: string, targetDate: string): string[] {
	const files: string[] = [];

	function walk(currentDir: string) {
		try {
			const entries = readdirSync(currentDir);
			for (const entry of entries) {
				const fullPath = join(currentDir, entry);
				try {
					const stat = statSync(fullPath);
					if (stat.isDirectory()) {
						walk(fullPath);
					} else if (entry.endsWith(".jsonl")) {
						// Check if file was modified on target date
						const mtime = stat.mtime.toISOString().split("T")[0];
						if (mtime === targetDate) {
							files.push(fullPath);
						}
					}
				} catch {
					// Skip inaccessible files
				}
			}
		} catch {
			// Skip inaccessible directories
		}
	}

	walk(dir);
	return files;
}

function parseJsonlFile(filePath: string): MessageEntry[] {
	try {
		const content = readFileSync(filePath, "utf-8");
		const lines = content.split("\n").filter((line) => line.trim());
		return lines
			.map((line) => {
				try {
					return JSON.parse(line) as MessageEntry;
				} catch {
					return null;
				}
			})
			.filter((entry): entry is MessageEntry => entry !== null);
	} catch {
		return [];
	}
}

function createUniqueHash(entry: MessageEntry): string | null {
	const messageId = entry.message?.id;
	const requestId = entry.requestId;
	if (!messageId || !requestId) return null;
	return `${messageId}:${requestId}`;
}

interface TokenTotals {
	input: number;
	output: number;
	cacheCreate: number;
	cacheRead: number;
	cost: number;
}

function main() {
	const targetDate = process.argv[2] || new Date().toISOString().split("T")[0];
	const projectFilter = process.argv[3]; // Optional: filter to specific project
	const claudeDir = join(homedir(), ".claude", "projects");

	console.log(`\n📊 Fixed Cost Calculator (Last-Chunk Method)`);
	console.log(`📅 Date: ${targetDate}`);

	let scanDir = claudeDir;
	if (projectFilter) {
		// Find matching project directory
		const entries = readdirSync(claudeDir);
		const match = entries.find((e) =>
			e.toLowerCase().includes(projectFilter.toLowerCase()),
		);
		if (match) {
			scanDir = join(claudeDir, match);
			console.log(`📁 Project: ${match}`);
		}
	}
	console.log(`📁 Scanning: ${scanDir}\n`);

	const files = findJsonlFiles(scanDir, targetDate);
	console.log(`Found ${files.length} JSONL files modified on ${targetDate}\n`);

	// Track last entry per unique hash (THE FIX)
	const lastEntryPerHash = new Map<
		string,
		{ entry: MessageEntry; model: string }
	>();

	// Also track buggy first-entry for comparison
	const firstEntryPerHash = new Map<
		string,
		{ entry: MessageEntry; model: string }
	>();

	for (const file of files) {
		const entries = parseJsonlFile(file);

		for (const entry of entries) {
			if (entry.type !== "assistant" || !entry.message?.usage) continue;

			const hash = createUniqueHash(entry);
			if (!hash) continue;

			const model = entry.message.model || "unknown";

			// FIXED: Keep LAST entry (overwrite)
			lastEntryPerHash.set(hash, { entry, model });

			// BUGGY: Keep FIRST entry (skip if exists)
			if (!firstEntryPerHash.has(hash)) {
				firstEntryPerHash.set(hash, { entry, model });
			}
		}
	}

	// Calculate totals per model - FIXED
	const fixedTotals = new Map<string, TokenTotals>();
	for (const { entry, model } of lastEntryPerHash.values()) {
		const usage = entry.message?.usage;
		if (!usage) continue;

		if (!fixedTotals.has(model)) {
			fixedTotals.set(model, {
				input: 0,
				output: 0,
				cacheCreate: 0,
				cacheRead: 0,
				cost: 0,
			});
		}

		const totals = fixedTotals.get(model)!;
		totals.input += usage.input_tokens || 0;
		totals.output += usage.output_tokens || 0;
		totals.cacheCreate += usage.cache_creation_input_tokens || 0;
		totals.cacheRead += usage.cache_read_input_tokens || 0;
	}

	// Calculate totals per model - BUGGY
	const buggyTotals = new Map<string, TokenTotals>();
	for (const { entry, model } of firstEntryPerHash.values()) {
		const usage = entry.message?.usage;
		if (!usage) continue;

		if (!buggyTotals.has(model)) {
			buggyTotals.set(model, {
				input: 0,
				output: 0,
				cacheCreate: 0,
				cacheRead: 0,
				cost: 0,
			});
		}

		const totals = buggyTotals.get(model)!;
		totals.input += usage.input_tokens || 0;
		totals.output += usage.output_tokens || 0;
		totals.cacheCreate += usage.cache_creation_input_tokens || 0;
		totals.cacheRead += usage.cache_read_input_tokens || 0;
	}

	// Calculate costs
	function calcCost(totals: Map<string, TokenTotals>): number {
		let totalCost = 0;
		for (const [model, t] of totals) {
			const pricing = PRICING[model] || DEFAULT_PRICING;
			t.cost =
				(t.input * pricing.input +
					t.output * pricing.output +
					t.cacheCreate * pricing.cacheCreate +
					t.cacheRead * pricing.cacheRead) /
				1_000_000;
			totalCost += t.cost;
		}
		return totalCost;
	}

	const fixedTotal = calcCost(fixedTotals);
	const buggyTotal = calcCost(buggyTotals);

	// Display results
	console.log("═".repeat(70));
	console.log("FIXED CALCULATION (Last Chunk - Correct)");
	console.log("═".repeat(70));

	for (const [model, t] of fixedTotals) {
		const shortModel = model
			.replace("claude-", "")
			.replace("-20251001", "")
			.replace("-20251101", "")
			.replace("-20250514", "")
			.replace("-20241022", "");
		console.log(`\n  ${shortModel}:`);
		console.log(
			`    Input:        ${t.input.toLocaleString().padStart(12)} tokens`,
		);
		console.log(
			`    Output:       ${t.output.toLocaleString().padStart(12)} tokens`,
		);
		console.log(
			`    Cache Create: ${t.cacheCreate.toLocaleString().padStart(12)} tokens`,
		);
		console.log(
			`    Cache Read:   ${t.cacheRead.toLocaleString().padStart(12)} tokens`,
		);
		console.log(`    Cost:         $${t.cost.toFixed(2)}`);
	}

	console.log(`\n  ${"─".repeat(40)}`);
	console.log(`  TOTAL: $${fixedTotal.toFixed(2)}`);

	// Comparison
	console.log("\n");
	console.log("═".repeat(70));
	console.log("COMPARISON");
	console.log("═".repeat(70));

	let totalFixedOutput = 0;
	let totalBuggyOutput = 0;
	for (const t of fixedTotals.values()) totalFixedOutput += t.output;
	for (const t of buggyTotals.values()) totalBuggyOutput += t.output;

	console.log(`\n  Fixed (correct):  $${fixedTotal.toFixed(2)}`);
	console.log(`  Buggy (ccusage):  $${buggyTotal.toFixed(2)}`);
	console.log(
		`  Difference:       $${(fixedTotal - buggyTotal).toFixed(2)} (${((1 - buggyTotal / fixedTotal) * 100).toFixed(1)}% underreported)`,
	);
	console.log(`\n  Output tokens:`);
	console.log(`    Fixed: ${totalFixedOutput.toLocaleString()}`);
	console.log(`    Buggy: ${totalBuggyOutput.toLocaleString()}`);
	console.log(
		`    Ratio: ${(totalFixedOutput / totalBuggyOutput).toFixed(1)}x undercount`,
	);
	console.log();
}

main();
