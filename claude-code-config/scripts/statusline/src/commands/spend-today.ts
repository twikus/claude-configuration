#!/usr/bin/env bun

import { table } from "table";
import { formatCost, formatDuration } from "../lib/formatters";
import {
	calculateTotalCost,
	calculateTotalDuration,
	filterSessionsByDate,
	getTodayStart,
	loadSpendData,
} from "../lib/spend";

async function main() {
	const data = await loadSpendData();
	const today = getTodayStart();
	const todaySessions = filterSessionsByDate(data.sessions, today);

	if (todaySessions.length === 0) {
		console.log("📊 No sessions today");
		return;
	}

	const totalCost = calculateTotalCost(todaySessions);
	const totalDuration = calculateTotalDuration(todaySessions);

	console.log(`\n📊 Today's Spend\n`);
	console.log(`Sessions: ${todaySessions.length}`);
	console.log(`Total Cost: $${formatCost(totalCost)}`);
	console.log(`Total Duration: ${formatDuration(totalDuration)}`);
	console.log(`\n📝 Sessions:\n`);

	const filteredSessions = todaySessions
		.filter((session) => session.cost >= 0.1)
		.sort((a, b) => b.cost - a.cost);

	const tableData = [
		["Cost", "Duration", "Changes", "Directory"],
		...filteredSessions.map((session) => [
			`$${formatCost(session.cost)}`,
			formatDuration(session.duration_ms),
			`+${session.lines_added} -${session.lines_removed}`,
			session.cwd.replace(/^\/Users\/[^/]+\//, "~/"),
		]),
	];

	console.log(table(tableData));
}

main();
