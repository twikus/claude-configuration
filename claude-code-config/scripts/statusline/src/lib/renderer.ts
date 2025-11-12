import type { StatuslineConfig } from "../../statusline.config";
import type { StatuslineData } from "../index";
import { renderStatusline as render } from "../index";
import { getContextData } from "./context";
import {
	formatBranch,
	formatCost,
	formatDuration,
	formatPath,
} from "./formatters";
import { getGitStatus } from "./git";
import { getTodayCost } from "./spend";
import type { HookInput } from "./types";
import { getCurrentPeriodCost, getUsageLimits } from "./usage-limits";

export async function renderStatusline(
	input: HookInput,
	config: StatuslineConfig,
): Promise<{ output: string }> {
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

	const output = render(data, config);
	return { output };
}
