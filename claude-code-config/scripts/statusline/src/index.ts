#!/usr/bin/env bun

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { StatuslineConfig } from "../statusline.config";
import { defaultConfig } from "../statusline.config";
import { getContextData } from "./lib/context";
import {
	colors,
	formatBranch,
	formatCost,
	formatDuration,
	formatPath,
	formatProgressBar,
	formatResetTime,
	formatSession,
} from "./lib/formatters";
import { getGitStatus } from "./lib/git";
import { getTodayCost, saveSession } from "./lib/spend";
import type { HookInput } from "./lib/types";
import { getCurrentPeriodCost, getUsageLimits } from "./lib/usage-limits";

const CONFIG_FILE_PATH = join(import.meta.dir, "..", "statusline.config.json");

async function loadConfig(): Promise<StatuslineConfig> {
	try {
		const content = await readFile(CONFIG_FILE_PATH, "utf-8");
		return JSON.parse(content);
	} catch {
		return defaultConfig;
	}
}

export interface UsageLimit {
	utilization: number;
	resets_at: string | null;
}

export interface StatuslineData {
	branch: string;
	dirPath: string;
	modelName: string;
	sessionCost: string;
	sessionDuration: string;
	contextTokens: number;
	contextPercentage: number;
	usageLimits: {
		five_hour: UsageLimit | null;
		seven_day: UsageLimit | null;
	};
	periodCost: number;
	todayCost: number;
}

function shouldShowWeekly(
	weeklyConfig: StatuslineConfig["weeklyUsage"],
	fiveHourUtilization: number | null,
): boolean {
	if (weeklyConfig.enabled === true) return true;
	if (weeklyConfig.enabled === false) return false;
	if (weeklyConfig.enabled === "90%" && fiveHourUtilization !== null) {
		return fiveHourUtilization >= 90;
	}
	return false;
}

export function renderStatusline(
	data: StatuslineData,
	config: StatuslineConfig,
): string {
	const sep = colors.gray(config.separator);
	const parts: string[] = [];

	const isSonnet = data.modelName.toLowerCase().includes("sonnet");
	if (isSonnet && !config.showSonnetModel) {
		parts.push(`${data.branch} ${sep} ${colors.lightGray(data.dirPath)}`);
	} else {
		parts.push(
			`${data.branch} ${sep} ${colors.lightGray(data.dirPath)} ${sep} ${colors.lightGray(data.modelName)}`,
		);
	}

	const sessionPart = formatSession(
		data.sessionCost,
		data.sessionDuration,
		data.contextTokens,
		config.context.maxContextTokens,
		data.contextPercentage,
		config.session,
	);
	parts.push(sessionPart);

	const fiveHour = data.usageLimits.five_hour;
	if (config.limits.enabled && config.limits.percentage.enabled && fiveHour) {
		const limitsParts: string[] = [];

		if (config.limits.showCost && data.periodCost > 0) {
			limitsParts.push(
				`${colors.gray("$")}${colors.lightGray(formatCost(data.periodCost))}`,
			);
		}

		if (config.limits.percentage.progressBar.enabled) {
			const bar = formatProgressBar({
				percentage: fiveHour.utilization,
				length: config.limits.percentage.progressBar.length,
				style: config.limits.percentage.progressBar.style,
				colorMode: config.limits.percentage.progressBar.color,
				background: config.limits.percentage.progressBar.background,
			});
			limitsParts.push(bar);
		}

		if (config.limits.percentage.showValue) {
			limitsParts.push(
				`${colors.lightGray(fiveHour.utilization.toString())}${colors.gray("%")}`,
			);
		}

		if (config.limits.showTimeLeft && fiveHour.resets_at) {
			const resetTime = formatResetTime(fiveHour.resets_at);
			limitsParts.push(colors.gray(`(${resetTime})`));
		}

		if (limitsParts.length > 0) {
			parts.push(`${colors.gray("L:")} ${limitsParts.join(" ")}`);
		}
	}

	const sevenDay = data.usageLimits.seven_day;
	if (
		shouldShowWeekly(config.weeklyUsage, fiveHour?.utilization ?? null) &&
		config.weeklyUsage.percentage.enabled &&
		sevenDay
	) {
		const weeklyParts: string[] = [];

		if (config.weeklyUsage.showCost && data.periodCost > 0) {
			weeklyParts.push(
				`${colors.gray("$")}${colors.lightGray(formatCost(data.periodCost))}`,
			);
		}

		if (config.weeklyUsage.percentage.progressBar.enabled) {
			const bar = formatProgressBar({
				percentage: sevenDay.utilization,
				length: config.weeklyUsage.percentage.progressBar.length,
				style: config.weeklyUsage.percentage.progressBar.style,
				colorMode: config.weeklyUsage.percentage.progressBar.color,
				background: config.weeklyUsage.percentage.progressBar.background,
			});
			weeklyParts.push(bar);
		}

		if (config.weeklyUsage.percentage.showValue) {
			weeklyParts.push(
				`${colors.lightGray(sevenDay.utilization.toString())}${colors.gray("%")}`,
			);
		}

		if (config.weeklyUsage.showTimeLeft && sevenDay.resets_at) {
			const resetTime = formatResetTime(sevenDay.resets_at);
			weeklyParts.push(colors.gray(`(${resetTime})`));
		}

		if (weeklyParts.length > 0) {
			parts.push(`${colors.gray("W:")} ${weeklyParts.join(" ")}`);
		}
	}

	if (config.dailySpend.enabled && data.todayCost > 0) {
		parts.push(
			`${colors.gray("D:")} ${colors.gray("$")}${colors.lightGray(formatCost(data.todayCost))}`,
		);
	}

	const output = parts.join(` ${sep} `);

	return config.oneLine
		? output
		: output.replace(sessionPart, `\n${sessionPart}`);
}

async function main() {
	try {
		const input: HookInput = await Bun.stdin.json();
		const config = await loadConfig();

		await saveSession(input);

		const git = await getGitStatus();
		const contextData = await getContextData({
			transcriptPath: input.transcript_path,
			maxContextTokens: config.context.maxContextTokens,
			autocompactBufferTokens: config.context.autocompactBufferTokens,
			useUsableContextOnly: config.context.useUsableContextOnly,
			overheadTokens: config.context.overheadTokens,
		});
		const usageLimits = await getUsageLimits();
		const periodCost = await getCurrentPeriodCost();
		const todayCost = await getTodayCost();

		const data: StatuslineData = {
			branch: formatBranch(git, config.git),
			dirPath: formatPath(input.workspace.current_dir, config.pathDisplayMode),
			modelName: input.model.display_name,
			sessionCost: formatCost(input.cost.total_cost_usd),
			sessionDuration: formatDuration(input.cost.total_duration_ms),
			contextTokens: contextData.tokens,
			contextPercentage: contextData.percentage,
			usageLimits: {
				five_hour: usageLimits.five_hour
					? {
							utilization: usageLimits.five_hour.utilization,
							resets_at: usageLimits.five_hour.resets_at,
						}
					: null,
				seven_day: usageLimits.seven_day
					? {
							utilization: usageLimits.seven_day.utilization,
							resets_at: usageLimits.seven_day.resets_at,
						}
					: null,
			},
			periodCost,
			todayCost,
		};

		const output = renderStatusline(data, config);
		console.log(output);
		if (config.oneLine) {
			console.log("");
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.log(`${colors.red("Error:")} ${errorMessage}`);
		console.log(colors.gray("Check statusline configuration"));
	}
}

main();
