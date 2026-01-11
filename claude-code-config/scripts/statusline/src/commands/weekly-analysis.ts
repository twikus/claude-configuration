#!/usr/bin/env bun

import { colors, formatProgressBar } from "../lib/formatters";
import { getUsageLimits } from "../lib/usage-limits";

const WEEKLY_HOURS = 168; // 7 days * 24 hours

function calculateTimeProgress(resetsAt: string | null): {
	hoursRemaining: number;
	hoursElapsed: number;
	timeElapsedPercent: number;
} {
	if (!resetsAt) {
		return {
			hoursRemaining: 0,
			hoursElapsed: WEEKLY_HOURS,
			timeElapsedPercent: 100,
		};
	}

	const resetDate = new Date(resetsAt);
	const now = new Date();
	const diffMs = resetDate.getTime() - now.getTime();
	const hoursRemaining = Math.max(0, diffMs / 3600000);
	const hoursElapsed = WEEKLY_HOURS - hoursRemaining;
	const timeElapsedPercent = (hoursElapsed / WEEKLY_HOURS) * 100;

	return { hoursRemaining, hoursElapsed, timeElapsedPercent };
}

function formatHours(hours: number): string {
	const days = Math.floor(hours / 24);
	const remainingHours = Math.floor(hours % 24);
	const minutes = Math.floor((hours % 1) * 60);

	if (days > 0) {
		return `${days}d ${remainingHours}h`;
	}
	if (remainingHours > 0) {
		return `${remainingHours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

function getDeltaColor(delta: number): (text: string | number) => string {
	if (delta > 5) return colors.green;
	if (delta > 0) return colors.lightGray;
	if (delta > -5) return colors.yellow;
	if (delta > -15) return colors.orange;
	return colors.red;
}

function formatDelta(delta: number): string {
	const colorFn = getDeltaColor(delta);
	const sign = delta >= 0 ? "+" : "";
	return colorFn(`${sign}${delta.toFixed(1)}%`);
}

function getStatusEmoji(delta: number): string {
	if (delta > 10) return "🚀";
	if (delta > 0) return "✅";
	if (delta > -10) return "⚠️";
	return "🔴";
}

async function main() {
	const limits = await getUsageLimits();

	console.log("");
	console.log(colors.bold("📊 Weekly Usage Analysis"));
	console.log(colors.gray("─".repeat(40)));

	if (!limits.seven_day) {
		console.log(colors.red("No weekly limit data available"));
		return;
	}

	const { utilization, resets_at } = limits.seven_day;
	const { hoursRemaining, hoursElapsed, timeElapsedPercent } =
		calculateTimeProgress(resets_at);

	const expectedUsage = timeElapsedPercent;
	const delta = utilization - expectedUsage;
	const statusEmoji = getStatusEmoji(delta);

	console.log("");
	console.log(colors.gray("Time Progress:"));
	console.log(
		`  ${formatProgressBar({
			percentage: timeElapsedPercent,
			length: 15,
			style: "filled",
			colorMode: "progressive",
			background: "none",
		})} ${colors.lightGray(timeElapsedPercent.toFixed(1))}${colors.gray("%")}`,
	);
	console.log(
		`  ${colors.gray("Elapsed:")} ${colors.lightGray(formatHours(hoursElapsed))} ${colors.gray("/")} ${colors.lightGray("168h")}`,
	);
	console.log(
		`  ${colors.gray("Remaining:")} ${colors.cyan(formatHours(hoursRemaining))}`,
	);

	console.log("");
	console.log(colors.gray("Usage Progress:"));
	console.log(
		`  ${formatProgressBar({
			percentage: utilization,
			length: 15,
			style: "filled",
			colorMode: "progressive",
			background: "none",
		})} ${colors.lightGray(utilization.toString())}${colors.gray("%")}`,
	);

	console.log("");
	console.log(colors.gray("─".repeat(40)));
	console.log("");

	console.log(colors.gray("Analysis:"));
	console.log(
		`  ${colors.gray("Expected at this point:")} ${colors.lightGray(expectedUsage.toFixed(1))}${colors.gray("%")}`,
	);
	console.log(
		`  ${colors.gray("Actual usage:")} ${colors.lightGray(utilization.toString())}${colors.gray("%")}`,
	);
	console.log(
		`  ${colors.gray("Delta:")} ${formatDelta(delta)} ${statusEmoji}`,
	);

	console.log("");

	if (delta > 0) {
		console.log(
			`  ${colors.green("→")} You're ${colors.green(Math.abs(delta).toFixed(1) + "%")} ${colors.lightGray("ahead of schedule")}`,
		);
	} else if (delta < 0) {
		console.log(
			`  ${colors.yellow("→")} You're ${colors.yellow(Math.abs(delta).toFixed(1) + "%")} ${colors.lightGray("behind schedule")}`,
		);
	} else {
		console.log(
			`  ${colors.cyan("→")} ${colors.lightGray("Perfectly on track!")}`,
		);
	}

	console.log("");

	if (limits.five_hour) {
		console.log(colors.gray("─".repeat(40)));
		console.log("");
		console.log(colors.gray("Session Limit (5h):"));
		console.log(
			`  ${formatProgressBar({
				percentage: limits.five_hour.utilization,
				length: 15,
				style: "filled",
				colorMode: "progressive",
				background: "none",
			})} ${colors.lightGray(limits.five_hour.utilization.toString())}${colors.gray("%")}`,
		);
		console.log("");
	}
}

main();
