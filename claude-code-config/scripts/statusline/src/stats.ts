#!/usr/bin/env bun

import { colors, formatProgressBar } from "./lib/formatters";
import { getDailyUsageStats } from "./lib/usage-limits";

async function main() {
	const stats = await getDailyUsageStats();

	if (stats.totalDays === 0) {
		console.log(`${colors.YELLOW}No usage data available yet.${colors.RESET}`);
		console.log(
			`${colors.GRAY}Data will be collected as you use Claude Code.${colors.RESET}`,
		);
		return;
	}

	console.log(`${colors.LIGHT_GRAY}Daily Usage Statistics${colors.RESET}\n`);
	console.log(
		`${colors.GRAY}Average:${colors.RESET} ${colors.LIGHT_GRAY}${stats.average.toFixed(1)}%${colors.RESET}`,
	);
	console.log(
		`${colors.GRAY}Total days:${colors.RESET} ${colors.LIGHT_GRAY}${stats.totalDays}${colors.RESET}`,
	);
	console.log(
		`${colors.GRAY}Total sessions:${colors.RESET} ${colors.LIGHT_GRAY}${stats.totalSessions}${colors.RESET}`,
	);
	console.log(
		`${colors.GRAY}Total cost:${colors.RESET} ${colors.LIGHT_GRAY}$${stats.totalCost.toFixed(2)}${colors.RESET}\n`,
	);

	console.log(`${colors.GRAY}Recent usage (last 7 days):${colors.RESET}`);
	const recent = stats.dailyAverages.slice(0, 7);

	for (const day of recent) {
		const date = new Date(day.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
		const bar = formatProgressBar(
			day.average,
			10,
			"braille",
			"progressive",
			"none",
		);

		const sessionsInfo =
			day.sessionCount > 1
				? `${colors.GRAY}(${day.sessionCount} periods: avg ${day.average.toFixed(0)}%, max ${day.max}%, min ${day.min}% | $${day.totalCost.toFixed(2)})${colors.RESET}`
				: `${colors.LIGHT_GRAY}${day.average.toFixed(0)}% | $${day.totalCost.toFixed(2)}${colors.RESET}`;

		console.log(
			`  ${colors.GRAY}${date.padEnd(8)}${colors.RESET} ${bar} ${sessionsInfo}`,
		);
	}
}

main();
