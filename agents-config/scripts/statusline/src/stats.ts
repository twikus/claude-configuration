#!/usr/bin/env bun

import { getDb } from "./lib/features/spend/database";
import { colors, formatProgressBar } from "./lib/formatters";

interface DailyStats {
	date: string;
	sessionCount: number;
	totalCost: number;
	totalDuration: number;
}

function getDailyStats(): DailyStats[] {
	const db = getDb();

	const rows = db
		.query<
			{
				date: string;
				session_count: number;
				total_cost: number;
				total_duration: number;
			},
			[]
		>(
			`SELECT
				date,
				COUNT(*) as session_count,
				SUM(total_cost) as total_cost,
				SUM(duration_ms) as total_duration
			FROM sessions
			GROUP BY date
			ORDER BY date DESC
			LIMIT 30`,
		)
		.all();

	return rows.map((row) => ({
		date: row.date,
		sessionCount: row.session_count,
		totalCost: row.total_cost,
		totalDuration: row.total_duration,
	}));
}

function getTotalStats(): {
	totalSessions: number;
	totalCost: number;
	totalDays: number;
} {
	const db = getDb();

	const result = db
		.query<
			{ total_sessions: number; total_cost: number; total_days: number },
			[]
		>(
			`SELECT
				COUNT(*) as total_sessions,
				COALESCE(SUM(total_cost), 0) as total_cost,
				COUNT(DISTINCT date) as total_days
			FROM sessions`,
		)
		.get();

	return {
		totalSessions: result?.total_sessions ?? 0,
		totalCost: result?.total_cost ?? 0,
		totalDays: result?.total_days ?? 0,
	};
}

async function main() {
	const totals = getTotalStats();
	const dailyStats = getDailyStats();

	if (totals.totalDays === 0) {
		console.log(colors.yellow("No usage data available yet."));
		console.log(colors.gray("Data will be collected as you use Claude Code."));
		return;
	}

	const avgCostPerDay = totals.totalCost / totals.totalDays;

	console.log(`${colors.lightGray("Daily Usage Statistics")}\n`);
	console.log(`${colors.gray("Total days:")} ${totals.totalDays}`);
	console.log(`${colors.gray("Total sessions:")} ${totals.totalSessions}`);
	console.log(`${colors.gray("Total cost:")} $${totals.totalCost.toFixed(2)}`);
	console.log(`${colors.gray("Avg cost/day:")} $${avgCostPerDay.toFixed(2)}\n`);

	console.log(colors.gray("Recent usage (last 7 days):"));
	const recent = dailyStats.slice(0, 7);

	const maxCost = Math.max(...recent.map((d) => d.totalCost), 1);

	for (const day of recent) {
		const date = new Date(day.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});

		const percentage = (day.totalCost / maxCost) * 100;
		const bar = formatProgressBar({
			percentage,
			length: 10,
			style: "braille",
			colorMode: "progressive",
			background: "none",
		});

		const info = colors.gray(
			`(${day.sessionCount} sessions | $${day.totalCost.toFixed(2)})`,
		);

		console.log(`  ${colors.gray(date.padEnd(8))} ${bar} ${info}`);
	}
}

main();
