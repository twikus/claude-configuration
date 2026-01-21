#!/usr/bin/env bun

import {
	getPayloadsGroupedBySession,
	getTodayPayloads,
	type PayloadLogEntry,
	readPayloadLogs,
	rotatePayloadLogs,
} from "./lib/features/spend/payload-logger";
import { colors } from "./lib/formatters";

function formatCost(cost: number): string {
	return `$${cost.toFixed(4)}`;
}

function formatDuration(ms: number): string {
	const minutes = Math.floor(ms / 60000);
	const hours = Math.floor(minutes / 60);
	if (hours > 0) {
		return `${hours}h${minutes % 60}m`;
	}
	return `${minutes}m`;
}

function analyzeSessionProgression(entries: PayloadLogEntry[]): void {
	if (entries.length === 0) return;

	const sorted = [...entries].sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
	);

	console.log(
		`  ${colors.gray("Events:")} ${sorted.length} | ${colors.gray("First:")} ${sorted[0].timestamp.split("T")[1].split(".")[0]} | ${colors.gray("Last:")} ${sorted[sorted.length - 1].timestamp.split("T")[1].split(".")[0]}`,
	);

	let prevCost = 0;
	let anomalies = 0;

	for (const entry of sorted) {
		const costDelta = entry.total_cost_usd - prevCost;
		const ctx = entry.context;

		if (ctx) {
			const flags = [];
			if (ctx.is_new_session) flags.push(colors.yellow("NEW"));
			if (ctx.is_clear_continuation) flags.push(colors.red("CLEAR"));
			if (ctx.delta_cost && ctx.delta_cost < 0) {
				flags.push(colors.red("NEG_DELTA"));
				anomalies++;
			}
			if (costDelta < 0) {
				flags.push(colors.red("COST_DROP"));
				anomalies++;
			}

			if (flags.length > 0 || costDelta > 1) {
				console.log(
					`    ${entry.timestamp.split("T")[1].split(".")[0]} | ${formatCost(entry.total_cost_usd)} (Δ${formatCost(costDelta)}) | ctx_delta: ${formatCost(ctx.delta_cost ?? 0)} | ${flags.join(" ")}`,
				);
			}
		}

		prevCost = entry.total_cost_usd;
	}

	if (anomalies > 0) {
		console.log(colors.red(`  ⚠ ${anomalies} anomalies detected`));
	}
}

function showTodaySummary(): void {
	const entries = getTodayPayloads();

	console.log(`\n${colors.lightGray("Today's Payload Summary")}\n`);
	console.log(`${colors.gray("Total events:")} ${entries.length}`);

	if (entries.length === 0) {
		console.log(colors.yellow("No payloads logged today yet."));
		return;
	}

	const grouped = new Map<string, PayloadLogEntry[]>();
	for (const entry of entries) {
		const existing = grouped.get(entry.session_id) || [];
		existing.push(entry);
		grouped.set(entry.session_id, existing);
	}

	console.log(`${colors.gray("Unique sessions:")} ${grouped.size}\n`);

	const sessions = Array.from(grouped.entries())
		.map(([id, entries]) => ({
			id,
			entries,
			lastCost: entries[entries.length - 1].total_cost_usd,
			eventCount: entries.length,
		}))
		.sort((a, b) => b.lastCost - a.lastCost);

	console.log(colors.gray("Sessions by cost (descending):"));

	for (const session of sessions.slice(0, 20)) {
		const firstEntry = session.entries[0];
		const cwdShort = firstEntry.cwd.split("/").slice(-2).join("/");

		console.log(
			`\n${colors.lightGray(session.id.slice(0, 8))} | ${colors.gray(cwdShort)} | ${formatCost(session.lastCost)}`,
		);
		analyzeSessionProgression(session.entries);
	}
}

function showAllSessions(): void {
	const grouped = getPayloadsGroupedBySession();

	console.log(`\n${colors.lightGray("All Sessions Analysis")}\n`);
	console.log(`${colors.gray("Total unique sessions:")} ${grouped.size}`);

	const totalEntries = readPayloadLogs().length;
	console.log(`${colors.gray("Total logged events:")} ${totalEntries}\n`);

	const sessions = Array.from(grouped.entries())
		.map(([id, entries]) => ({
			id,
			entries,
			lastCost: entries[entries.length - 1].total_cost_usd,
			firstTimestamp: entries[0].timestamp,
		}))
		.sort(
			(a, b) =>
				new Date(b.firstTimestamp).getTime() -
				new Date(a.firstTimestamp).getTime(),
		);

	console.log(colors.gray("Recent sessions:"));

	for (const session of sessions.slice(0, 10)) {
		const firstEntry = session.entries[0];
		const cwdShort = firstEntry.cwd.split("/").slice(-2).join("/");
		const date = session.firstTimestamp.split("T")[0];

		console.log(
			`\n${colors.lightGray(session.id.slice(0, 8))} | ${date} | ${colors.gray(cwdShort)} | ${formatCost(session.lastCost)}`,
		);
		analyzeSessionProgression(session.entries);
	}
}

function showHelp(): void {
	console.log(`
${colors.lightGray("Statusline Payload Debug Tool")}

${colors.gray("Usage:")}
  bun run statusline:debug [command]

${colors.gray("Commands:")}
  today     Show today's payload summary (default)
  all       Show all sessions analysis
  rotate    Rotate log file (keep last 10000 entries)
  help      Show this help

${colors.gray("Examples:")}
  bun run statusline:debug
  bun run statusline:debug today
  bun run statusline:debug all
  bun run statusline:debug rotate
`);
}

async function main(): Promise<void> {
	const command = process.argv[2] || "today";

	switch (command) {
		case "today":
			showTodaySummary();
			break;
		case "all":
			showAllSessions();
			break;
		case "rotate":
			rotatePayloadLogs();
			console.log(colors.green("✓ Log file rotated"));
			break;
		case "help":
		case "--help":
		case "-h":
			showHelp();
			break;
		default:
			console.log(colors.red(`Unknown command: ${command}`));
			showHelp();
	}
}

main();
