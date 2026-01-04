#!/usr/bin/env bun

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { StatuslineConfig } from "../statusline.config";
import { defaultConfig } from "../statusline.config";
import { getContextData } from "./lib/context";
import { getPeriodCost } from "./lib/database";
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
import { getTodayCostV2, saveSessionV2 } from "./lib/spend-v2";
import type { HookInput } from "./lib/types";
import { getUsageLimits } from "./lib/usage-limits";

const CONFIG_FILE_PATH = join(import.meta.dir, "..", "statusline.config.json");
const LAST_PAYLOAD_PATH = join(
	import.meta.dir,
	"..",
	"data",
	"last_payload.txt",
);

function normalizeResetsAt(resetsAt: string): string {
	try {
		const date = new Date(resetsAt);
		const minutes = date.getMinutes();
		const roundedMinutes = Math.round(minutes / 5) * 5;

		date.setMinutes(roundedMinutes);
		date.setSeconds(0);
		date.setMilliseconds(0);

		return date.toISOString();
	} catch {
		return resetsAt;
	}
}

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
		parts.push(`${data.branch} ${sep} ${colors.gray(data.dirPath)}`);
	} else {
		parts.push(
			`${data.branch} ${sep} ${colors.gray(data.dirPath)} ${sep} ${colors.peach(data.modelName)}`,
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

		if (config.limits.cost.enabled && data.periodCost > 0) {
			limitsParts.push(
				`${colors.gray("$")}${colors.dimWhite(formatCost(data.periodCost, config.limits.cost.format))}`,
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

		if (config.weeklyUsage.cost.enabled && data.periodCost > 0) {
			weeklyParts.push(
				`${colors.gray("$")}${colors.dimWhite(formatCost(data.periodCost, config.weeklyUsage.cost.format))}`,
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

	if (config.dailySpend.cost.enabled && data.todayCost > 0) {
		parts.push(
			`${colors.gray("D:")} ${colors.gray("$")}${colors.dimWhite(formatCost(data.todayCost, config.dailySpend.cost.format))}`,
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

		// Save last payload for debugging
		await writeFile(LAST_PAYLOAD_PATH, JSON.stringify(input, null, 2));

		const config = await loadConfig();

		// Get usage limits FIRST to ensure the current period entry exists
		// and to get the current resets_at for session tracking
		const usageLimits = await getUsageLimits();
		const currentResetsAt = usageLimits.five_hour?.resets_at ?? undefined;

		// Now save session with the current period context
		// This ensures costs are attributed to the correct period (DELTA only!)
		await saveSessionV2(input, currentResetsAt);

		const git = await getGitStatus();

		let contextTokens: number;
		let contextPercentage: number;

		const usePayloadContext =
			config.context.usePayloadContextWindow && input.context_window;

		if (usePayloadContext && input.context_window) {
			const maxTokens =
				input.context_window.context_window_size ||
				config.context.maxContextTokens;
			contextTokens = input.context_window.total_input_tokens;
			contextPercentage = Math.min(
				100,
				Math.round((contextTokens / maxTokens) * 100),
			);
		} else {
			const contextData = await getContextData({
				transcriptPath: input.transcript_path,
				maxContextTokens: config.context.maxContextTokens,
				autocompactBufferTokens: config.context.autocompactBufferTokens,
				useUsableContextOnly: config.context.useUsableContextOnly,
				overheadTokens: config.context.overheadTokens,
			});
			contextTokens = contextData.tokens;
			contextPercentage = contextData.percentage;
		}

		// Get period cost from SQLite (tracks DELTAS, not full session costs)
		const normalizedPeriodId = currentResetsAt
			? normalizeResetsAt(currentResetsAt)
			: null;
		const periodCost = normalizedPeriodId
			? getPeriodCost(normalizedPeriodId)
			: 0;
		const todayCost = getTodayCostV2();

		const data: StatuslineData = {
			branch: formatBranch(git, config.git),
			dirPath: formatPath(input.workspace.current_dir, config.pathDisplayMode),
			modelName: input.model.display_name,
			sessionCost: formatCost(
				input.cost.total_cost_usd,
				config.session.cost.format,
			),
			sessionDuration: formatDuration(input.cost.total_duration_ms),
			contextTokens,
			contextPercentage,
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
