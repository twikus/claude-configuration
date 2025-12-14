#!/usr/bin/env bun

import { table } from "table";
import { getSessionsByDate } from "../lib/database";
import { formatCost, formatDuration } from "../lib/formatters";

function getTodayDate(): string {
	return new Date().toISOString().split("T")[0];
}

async function main() {
	const today = getTodayDate();
	const todaySessions = getSessionsByDate(today);

	if (todaySessions.length === 0) {
		console.log("📊 No sessions today");
		return;
	}

	const totalCost = todaySessions.reduce((sum, s) => sum + s.total_cost, 0);
	const totalDuration = todaySessions.reduce(
		(sum, s) => sum + s.duration_ms,
		0,
	);

	console.log("\n📊 Today's Spend\n");
	console.log(`Sessions: ${todaySessions.length}`);
	console.log(`Total Cost: $${formatCost(totalCost)}`);
	console.log(`Total Duration: ${formatDuration(totalDuration)}`);
	console.log("\n📝 Sessions:\n");

	const filteredSessions = todaySessions
		.filter((session) => session.total_cost >= 0.1)
		.sort((a, b) => b.total_cost - a.total_cost);

	const tableData = [
		["Cost", "Duration", "Changes", "Directory"],
		...filteredSessions.map((session) => [
			`$${formatCost(session.total_cost)}`,
			formatDuration(session.duration_ms),
			`+${session.lines_added} -${session.lines_removed}`,
			session.cwd.replace(/^\/Users\/[^/]+\//, "~/"),
		]),
	];

	console.log(table(tableData));
}

main();
