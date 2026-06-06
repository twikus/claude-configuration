#!/usr/bin/env bun

import {
	type PayloadLogEntry,
	readPayloadLogs,
} from "./lib/features/spend/payload-logger";
import { colors } from "./lib/formatters";

function formatCost(cost: number): string {
	return `$${cost.toFixed(2)}`;
}

function getToday(): string {
	return new Date().toISOString().split("T")[0];
}

function getTodayPayloads(): PayloadLogEntry[] {
	const today = getToday();
	return readPayloadLogs().filter((e) => e.timestamp.startsWith(today));
}

interface SessionAnalysis {
	session_id: string;
	cwd: string;
	first_cost: number;
	last_cost: number;
	real_delta: number;
	entries: number;
}

function analyzePayloads(entries: PayloadLogEntry[]): SessionAnalysis[] {
	const sessions = new Map<string, PayloadLogEntry[]>();

	for (const entry of entries) {
		const existing = sessions.get(entry.session_id) || [];
		existing.push(entry);
		sessions.set(entry.session_id, existing);
	}

	const analyses: SessionAnalysis[] = [];

	for (const [sessionId, sessionEntries] of sessions) {
		const sorted = sessionEntries.sort(
			(a, b) =>
				new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
		);

		const first = sorted[0];
		const last = sorted[sorted.length - 1];

		// Real delta = last cost - first cost (what was ACTUALLY spent during observation)
		const realDelta = last.total_cost_usd - first.total_cost_usd;

		analyses.push({
			session_id: sessionId,
			cwd: first.cwd,
			first_cost: first.total_cost_usd,
			last_cost: last.total_cost_usd,
			real_delta: realDelta,
			entries: sorted.length,
		});
	}

	return analyses.sort((a, b) => b.real_delta - a.real_delta);
}

function showTodayUsage(): void {
	const today = getToday();
	const entries = getTodayPayloads();

	console.log(`\n${colors.lightGray(`Today's Usage (${today})`)}\n`);

	if (entries.length === 0) {
		console.log(colors.yellow("No payloads logged today."));
		return;
	}

	const analyses = analyzePayloads(entries);

	// Group by project
	const byProject = new Map<string, SessionAnalysis[]>();
	for (const a of analyses) {
		const project = a.cwd.split("/").slice(-2).join("/");
		const existing = byProject.get(project) || [];
		existing.push(a);
		byProject.set(project, existing);
	}

	let totalRealDelta = 0;

	console.log(colors.gray("Sessions by cost spent today:"));
	console.log(colors.gray("─".repeat(70)));

	for (const [project, sessions] of [...byProject.entries()].sort(
		(a, b) =>
			b[1].reduce((s, x) => s + x.real_delta, 0) -
			a[1].reduce((s, x) => s + x.real_delta, 0),
	)) {
		const projectTotal = sessions.reduce((s, x) => s + x.real_delta, 0);
		totalRealDelta += projectTotal;

		console.log(
			`\n${colors.lightGray(project)} ${colors.gray(`(${formatCost(projectTotal)})`)}`,
		);

		for (const s of sessions) {
			const startInfo =
				s.first_cost > 0
					? colors.gray(` (started@${formatCost(s.first_cost)})`)
					: "";

			console.log(
				`  ${s.session_id.slice(0, 8)} | ${formatCost(s.real_delta).padStart(7)} | ${formatCost(s.first_cost)} → ${formatCost(s.last_cost)} | ${s.entries} events${startInfo}`,
			);
		}
	}

	console.log(`\n${colors.gray("─".repeat(70))}`);
	console.log(
		`${colors.lightGray("Total spent today:")} ${colors.green(formatCost(totalRealDelta))}`,
	);
	console.log(
		`${colors.gray(`Sessions: ${analyses.length} | Events: ${entries.length}`)}`,
	);
}

function showHelp(): void {
	console.log(`
${colors.lightGray("Daily Usage Analyzer")}

${colors.gray("Usage:")}
  bun run statusline:usage

${colors.gray("Shows:")}
  - Today's real usage from payloads
  - Per-session cost (last_cost - first_cost)
  - Grouped by project
`);
}

async function main(): Promise<void> {
	const command = process.argv[2] || "today";

	switch (command) {
		case "today":
		case undefined:
			showTodayUsage();
			break;
		case "help":
		case "--help":
		case "-h":
			showHelp();
			break;
		default:
			showTodayUsage();
	}
}

main();
