#!/usr/bin/env bun

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defaultConfig, type StatuslineConfig } from "./lib/config";
import { getContextData } from "./lib/context";
import { getPeriodCost } from "./lib/database";
import {
	colors,
	formatBranch,
	formatCost,
	formatDuration,
	formatPath,
} from "./lib/formatters";
import { getGitStatus } from "./lib/git";
import {
	renderStatusline,
	type StatuslineData,
	type UsageLimit,
} from "./lib/render-pure";
import { getTodayCostV2, saveSessionV2 } from "./lib/spend-v2";
import type { HookInput } from "./lib/types";
import { getUsageLimits } from "./lib/usage-limits";

// Re-export from render-pure for backwards compatibility
export {
	renderStatusline,
	type StatuslineData,
	type UsageLimit,
} from "./lib/render-pure";

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

		let contextTokens: number | null;
		let contextPercentage: number | null;

		const usePayloadContext =
			config.context.usePayloadContextWindow && input.context_window;

		if (usePayloadContext) {
			const current = input.context_window?.current_usage;
			if (current) {
				contextTokens =
					(current.input_tokens || 0) +
					(current.cache_creation_input_tokens || 0) +
					(current.cache_read_input_tokens || 0);
				const maxTokens =
					input.context_window?.context_window_size ||
					config.context.maxContextTokens;
				contextPercentage = Math.min(
					100,
					Math.round((contextTokens / maxTokens) * 100),
				);
			} else {
				// No context data yet - session not started
				contextTokens = null;
				contextPercentage = null;
			}
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
