import type { StatuslineConfig } from "../../statusline.config";
import type { GitStatus } from "./git";

export const colors = {
	GREEN: "\x1b[0;32m",
	RED: "\x1b[0;31m",
	PURPLE: "\x1b[0;35m",
	YELLOW: "\x1b[0;33m",
	ORANGE: "\x1b[38;5;208m",
	GRAY: "\x1b[0;90m",
	LIGHT_GRAY: "\x1b[0;37m",
	CYAN: "\x1b[0;36m",
	BLUE: "\x1b[0;34m",
	BG_BLACK: "\x1b[40m",
	BG_DARK_GRAY: "\x1b[100m",
	BG_GRAY: "\x1b[47m",
	BG_BLUE: "\x1b[44m",
	BG_PURPLE: "\x1b[45m",
	BG_CYAN: "\x1b[46m",
	RESET: "\x1b[0m",
} as const;

export function formatBranch(
	git: GitStatus,
	gitConfig: StatuslineConfig["git"],
): string {
	let result = "";

	if (gitConfig.showBranch) {
		result = git.branch;
	}

	if (git.hasChanges) {
		const changes: string[] = [];

		if (gitConfig.showDirtyIndicator) {
			result += `${colors.PURPLE}*${colors.RESET}`;
		}

		if (gitConfig.showChanges) {
			const totalAdded = git.staged.added + git.unstaged.added;
			const totalDeleted = git.staged.deleted + git.unstaged.deleted;

			if (totalAdded > 0) {
				changes.push(`${colors.GREEN}+${totalAdded}${colors.RESET}`);
			}
			if (totalDeleted > 0) {
				changes.push(`${colors.RED}-${totalDeleted}${colors.RESET}`);
			}
		}

		if (gitConfig.showStaged && git.staged.files > 0) {
			changes.push(`${colors.GRAY}~${git.staged.files}${colors.RESET}`);
		}

		if (gitConfig.showUnstaged && git.unstaged.files > 0) {
			changes.push(`${colors.YELLOW}~${git.unstaged.files}${colors.RESET}`);
		}

		if (changes.length > 0) {
			result += ` ${changes.join(" ")}`;
		}
	}

	return result;
}

export function formatPath(
	path: string,
	mode: "full" | "truncated" | "basename" = "truncated",
): string {
	const home = process.env.HOME || "";
	let formattedPath = path;

	if (home && path.startsWith(home)) {
		formattedPath = `~${path.slice(home.length)}`;
	}

	if (mode === "basename") {
		const segments = path.split("/").filter((s) => s.length > 0);
		return segments[segments.length - 1] || path;
	}

	if (mode === "truncated") {
		const segments = formattedPath.split("/").filter((s) => s.length > 0);
		if (segments.length > 2) {
			return `/${segments.slice(-2).join("/")}`;
		}
	}

	return formattedPath;
}

export function formatCost(cost: number): string {
	return cost.toFixed(2);
}

export function formatTokens(tokens: number, showDecimals = true): string {
	if (tokens >= 1000000) {
		const value = tokens / 1000000;
		const number = showDecimals
			? value.toFixed(1)
			: Math.round(value).toString();
		return `${number}${colors.GRAY}m${colors.LIGHT_GRAY}`;
	}
	if (tokens >= 1000) {
		const value = tokens / 1000;
		const number = showDecimals
			? value.toFixed(1)
			: Math.round(value).toString();
		return `${number}${colors.GRAY}k${colors.LIGHT_GRAY}`;
	}
	return tokens.toString();
}

export function formatDuration(ms: number): string {
	const minutes = Math.floor(ms / 60000);
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours > 0) {
		return `${hours}h ${mins}m`;
	}
	return `${mins}m`;
}

export function formatResetTime(resetsAt: string): string {
	try {
		const resetDate = new Date(resetsAt);
		const now = new Date();
		const diffMs = resetDate.getTime() - now.getTime();

		if (diffMs <= 0) {
			return "now";
		}

		const hours = Math.floor(diffMs / 3600000);
		const minutes = Math.floor((diffMs % 3600000) / 60000);

		if (hours > 0) {
			return `${hours}h${minutes}m`;
		}
		return `${minutes}m`;
	} catch {
		return "N/A";
	}
}

function getProgressBarColor(
	percentage: number,
	colorMode: "progressive" | "green" | "yellow" | "red",
): string {
	if (colorMode === "progressive") {
		if (percentage < 50) return colors.GRAY;
		if (percentage < 70) return colors.YELLOW;
		if (percentage < 90) return colors.ORANGE;
		return colors.RED;
	}
	if (colorMode === "green") return colors.GREEN;
	if (colorMode === "yellow") return colors.YELLOW;
	return colors.RED;
}

function getProgressBarBackground(
	background: "none" | "dark" | "gray" | "light" | "blue" | "purple" | "cyan",
): string {
	if (background === "none") return "";
	if (background === "dark") return colors.BG_BLACK;
	if (background === "gray") return colors.BG_DARK_GRAY;
	if (background === "light") return colors.BG_GRAY;
	if (background === "blue") return colors.BG_BLUE;
	if (background === "purple") return colors.BG_PURPLE;
	if (background === "cyan") return colors.BG_CYAN;
	return "";
}

export function formatProgressBarFilled(
	percentage: number,
	length: number,
	colorMode: "progressive" | "green" | "yellow" | "red",
	background: "none" | "dark" | "gray" | "light" | "blue" | "purple" | "cyan",
): string {
	const filled = Math.round((percentage / 100) * length);
	const empty = length - filled;

	const filledBar = "█".repeat(filled);
	const emptyBar = "░".repeat(empty);
	const barColor = getProgressBarColor(percentage, colorMode);
	const bgColor = getProgressBarBackground(background);

	return `${barColor}${filledBar}${bgColor}${colors.GRAY}${emptyBar}${colors.RESET}`;
}

export function formatProgressBarRectangle(
	percentage: number,
	length: number,
	colorMode: "progressive" | "green" | "yellow" | "red",
	background: "none" | "dark" | "gray" | "light" | "blue" | "purple" | "cyan",
): string {
	const filled = Math.round((percentage / 100) * length);
	const empty = length - filled;

	const filledBar = "▰".repeat(filled);
	const emptyBar = "▱".repeat(empty);
	const barColor = getProgressBarColor(percentage, colorMode);
	const bgColor = getProgressBarBackground(background);

	return `${barColor}${filledBar}${bgColor}${colors.GRAY}${emptyBar}${colors.RESET}`;
}

export function formatProgressBarBraille(
	percentage: number,
	length: number,
	colorMode: "progressive" | "green" | "yellow" | "red",
	background: "none" | "dark" | "gray" | "light" | "blue" | "purple" | "cyan",
): string {
	const brailleChars = ["⣀", "⣄", "⣤", "⣦", "⣶", "⣷", "⣿"];

	const totalSteps = length * (brailleChars.length - 1);
	const currentStep = Math.round((percentage / 100) * totalSteps);

	const fullBlocks = Math.floor(currentStep / (brailleChars.length - 1));
	const partialIndex = currentStep % (brailleChars.length - 1);
	const emptyBlocks = length - fullBlocks - (partialIndex > 0 ? 1 : 0);

	const barColor = getProgressBarColor(percentage, colorMode);
	const bgColor = getProgressBarBackground(background);

	const fullPart = `${barColor}${"⣿".repeat(fullBlocks)}`;
	const partialPart =
		partialIndex > 0 ? `${barColor}${brailleChars[partialIndex]}` : "";
	const emptyPart =
		emptyBlocks > 0
			? `${bgColor}${colors.GRAY}${"⣀".repeat(emptyBlocks)}${colors.RESET}`
			: "";

	return `${fullPart}${partialPart}${emptyPart}`;
}

export function formatProgressBar(
	percentage: number,
	length: 5 | 10 | 15,
	style: "filled" | "rectangle" | "braille",
	colorMode: "progressive" | "green" | "yellow" | "red",
	background: "none" | "dark" | "gray" | "light" | "blue" | "purple" | "cyan",
): string {
	if (style === "rectangle") {
		return formatProgressBarRectangle(
			percentage,
			length,
			colorMode,
			background,
		);
	}
	if (style === "braille") {
		return formatProgressBarBraille(percentage, length, colorMode, background);
	}
	return formatProgressBarFilled(percentage, length, colorMode, background);
}

export function formatSession(
	cost: string,
	tokensUsed: number,
	tokensMax: number,
	percentage: number,
	config: StatuslineConfig["session"],
): string {
	const sessionItems: string[] = [];

	if (config.cost.enabled) {
		sessionItems.push(`$${cost}`);
	}

	if (config.tokens.enabled) {
		const formattedUsed = formatTokens(tokensUsed, config.tokens.showDecimals);
		if (config.tokens.showMax) {
			const formattedMax = formatTokens(tokensMax, config.tokens.showDecimals);
			sessionItems.push(
				`${formattedUsed}${colors.GRAY}/${formattedMax}${colors.LIGHT_GRAY}`,
			);
		} else {
			sessionItems.push(formattedUsed);
		}
	}

	if (config.percentage.enabled) {
		if (config.percentage.progressBar.enabled) {
			const bar = formatProgressBar(
				percentage,
				config.percentage.progressBar.length,
				config.percentage.progressBar.style,
				config.percentage.progressBar.color,
				config.percentage.progressBar.background,
			);
			sessionItems.push(
				`${bar} ${percentage}${colors.GRAY}%${colors.LIGHT_GRAY}`,
			);
		} else {
			sessionItems.push(`${percentage}${colors.GRAY}%${colors.LIGHT_GRAY}`);
		}
	}

	if (sessionItems.length === 0) {
		return "";
	}

	const infoSep = config.infoSeparator
		? ` ${colors.GRAY}${config.infoSeparator}${colors.LIGHT_GRAY} `
		: " ";
	return `${colors.GRAY}S:${colors.LIGHT_GRAY} ${sessionItems.join(infoSep)}`;
}
