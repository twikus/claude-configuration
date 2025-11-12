#!/usr/bin/env bun

import { colors, formatProgressBar } from "./lib/formatters";
import { getDailyUsageStats } from "./lib/usage-limits";

async function main() {
	const stats = await getDailyUsageStats();

	if (stats.totalDays === 0) {
		console.log(colors.yellow("No usage data available yet."));
		console.log(colors.gray("Data will be collected as you use Claude Code."));
		return;
	}

	console.log(`${colors.lightGray("Daily Usage Statistics")}\n`);
	console.log(`${colors.gray("Average:")} ${stats.average.toFixed(1)}%`);
	console.log(`${colors.gray("Total days:")} ${stats.totalDays}`);
	console.log(`${colors.gray("Total sessions:")} ${stats.totalSessions}`);
	console.log(`${colors.gray("Total cost:")} $${stats.totalCost.toFixed(2)}\n`);

	console.log(colors.gray("Recent usage (last 7 days):"));
	const recent = stats.dailyAverages.slice(0, 7);

	for (const day of recent) {
		const date = new Date(day.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
		const bar = formatProgressBar({
			percentage: day.average,
			length: 10,
			style: "braille",
			colorMode: "progressive",
			background: "none",
		});

		const sessionsInfo =
			day.sessionCount > 1
				? colors.gray(
						`(${day.sessionCount} periods: avg ${day.average.toFixed(0)}%, max ${day.max}%, min ${day.min}% | $${day.totalCost.toFixed(2)})`,
					)
				: `${day.average.toFixed(0)}% | $${day.totalCost.toFixed(2)}`;

		console.log(`  ${colors.gray(date.padEnd(8))} ${bar} ${sessionsInfo}`);
	}
}

main();
