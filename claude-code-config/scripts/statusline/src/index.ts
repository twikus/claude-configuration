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

function buildFirstLine(
	branch: string,
	dirPath: string,
	modelName: string,
	showSonnetModel: boolean,
	separator: string,
): string {
	const isSonnet = modelName.toLowerCase().includes("sonnet");
	const sep = `${colors.GRAY}${separator}${colors.LIGHT_GRAY}`;

	if (isSonnet && !showSonnetModel) {
		return `${colors.LIGHT_GRAY}${branch} ${sep} ${dirPath}${colors.RESET}`;
	}

	return `${colors.LIGHT_GRAY}${branch} ${sep} ${dirPath} ${sep} ${modelName}${colors.RESET}`;
}

function shouldShowWeeklyUsage(
	weeklyConfig: StatuslineConfig["weeklyUsage"],
	fiveHourUtilization: number | null,
): boolean {
	if (weeklyConfig.enabled === true) {
		return true;
	}

	if (weeklyConfig.enabled === false) {
		return false;
	}

	if (weeklyConfig.enabled === "90%" && fiveHourUtilization !== null) {
		return fiveHourUtilization >= 90;
	}

	return false;
}

function buildSecondLine(
	sessionCost: string,
	_sessionDuration: string,
	tokensUsed: number,
	tokensMax: number,
	contextPercentage: number,
	fiveHourUtilization: number | null,
	fiveHourReset: string | null,
	sevenDayUtilization: number | null,
	sevenDayReset: string | null,
	periodCost: number,
	todayCost: number,
	sessionConfig: StatuslineConfig["session"],
	limitsConfig: StatuslineConfig["limits"],
	weeklyConfig: StatuslineConfig["weeklyUsage"],
	dailySpendConfig: StatuslineConfig["dailySpend"],
	separator: string,
): string {
	let line = formatSession(
		sessionCost,
		tokensUsed,
		tokensMax,
		contextPercentage,
		sessionConfig,
	);

	const sep = `${colors.GRAY}${separator}`;

	if (
		limitsConfig.enabled &&
		limitsConfig.percentage.enabled &&
		fiveHourUtilization !== null &&
		fiveHourReset
	) {
		let limitsDisplay = "";

		if (limitsConfig.percentage.progressBar.enabled) {
			const bar = formatProgressBar(
				fiveHourUtilization,
				limitsConfig.percentage.progressBar.length,
				limitsConfig.percentage.progressBar.style,
				limitsConfig.percentage.progressBar.color,
				limitsConfig.percentage.progressBar.background,
			);

			limitsDisplay = `${bar} ${colors.LIGHT_GRAY}${fiveHourUtilization}${colors.GRAY}%`;
		} else {
			limitsDisplay = `${colors.LIGHT_GRAY}${fiveHourUtilization}${colors.GRAY}%`;
		}

		if (limitsConfig.showCost && periodCost > 0) {
			limitsDisplay += ` ${colors.GRAY}$${formatCost(periodCost)}`;
		}

		if (limitsConfig.showTimeLeft) {
			const resetTime = formatResetTime(fiveHourReset);
			limitsDisplay += ` ${colors.GRAY}(${resetTime})`;
		}

		line += ` ${sep} L: ${limitsDisplay}`;
	}

	if (
		shouldShowWeeklyUsage(weeklyConfig, fiveHourUtilization) &&
		weeklyConfig.percentage.enabled &&
		sevenDayUtilization !== null &&
		sevenDayReset
	) {
		if (weeklyConfig.percentage.progressBar.enabled) {
			const bar = formatProgressBar(
				sevenDayUtilization,
				weeklyConfig.percentage.progressBar.length,
				weeklyConfig.percentage.progressBar.style,
				weeklyConfig.percentage.progressBar.color,
				weeklyConfig.percentage.progressBar.background,
			);

			if (weeklyConfig.showTimeLeft) {
				const resetTime = formatResetTime(sevenDayReset);
				line += ` ${sep} W: ${bar} ${colors.LIGHT_GRAY}${sevenDayUtilization}${colors.GRAY}% ${colors.GRAY}(${resetTime})`;
			} else {
				line += ` ${sep} W: ${bar} ${colors.LIGHT_GRAY}${sevenDayUtilization}${colors.GRAY}%`;
			}
		} else {
			if (weeklyConfig.showTimeLeft) {
				const resetTime = formatResetTime(sevenDayReset);
				line += ` ${sep} W:${colors.LIGHT_GRAY} ${sevenDayUtilization}${colors.GRAY}% ${colors.GRAY}(${resetTime})`;
			} else {
				line += ` ${sep} W:${colors.LIGHT_GRAY} ${sevenDayUtilization}${colors.GRAY}%`;
			}
		}
	}

	if (dailySpendConfig.enabled && todayCost > 0) {
		line += ` ${sep} D:${colors.LIGHT_GRAY} $${formatCost(todayCost)}`;
	}

	line += colors.RESET;

	return line;
}

async function main() {
	try {
		const input: HookInput = await Bun.stdin.json();
		const config = await loadConfig();

		await saveSession(input);

		const git = await getGitStatus();
		const branch = formatBranch(git, config.git);
		const dirPath = formatPath(
			input.workspace.current_dir,
			config.pathDisplayMode,
		);

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

		const sessionCost = formatCost(input.cost.total_cost_usd);
		const sessionDuration = formatDuration(input.cost.total_duration_ms);

		const firstLine = buildFirstLine(
			branch,
			dirPath,
			input.model.display_name,
			config.showSonnetModel,
			config.separator,
		);
		const secondLine = buildSecondLine(
			sessionCost,
			sessionDuration,
			contextData.tokens,
			config.context.maxContextTokens,
			contextData.percentage,
			usageLimits.five_hour?.utilization ?? null,
			usageLimits.five_hour?.resets_at ?? null,
			usageLimits.seven_day?.utilization ?? null,
			usageLimits.seven_day?.resets_at ?? null,
			periodCost,
			todayCost,
			config.session,
			config.limits,
			config.weeklyUsage,
			config.dailySpend,
			config.separator,
		);

		if (config.oneLine) {
			const sep = ` ${colors.GRAY}${config.separator}${colors.LIGHT_GRAY} `;
			console.log(`${firstLine}${sep}${secondLine}`);
			console.log("");
		} else {
			console.log(firstLine);
			console.log(secondLine);
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.log(
			`${colors.RED}Error:${colors.LIGHT_GRAY} ${errorMessage}${colors.RESET}`,
		);
		console.log(`${colors.GRAY}Check statusline configuration${colors.RESET}`);
	}
}

main();
