export type Separator =
	| "|"
	| "•"
	| "·"
	| "⋅"
	| "●"
	| "◆"
	| "▪"
	| "▸"
	| "›"
	| "→";

export type ProgressBarStyle = "filled" | "rectangle" | "braille";
export type ProgressBarColor = "progressive" | "green" | "yellow" | "red";
export type ProgressBarBackground =
	| "none"
	| "dark"
	| "gray"
	| "light"
	| "blue"
	| "purple"
	| "cyan";

export interface ProgressBarConfig {
	enabled: boolean;
	// Progress bar length (number of characters)
	length: 5 | 10 | 15;
	style: ProgressBarStyle;
	color: ProgressBarColor;
	// Background color for empty portion of progress bar
	background: ProgressBarBackground;
}

export interface PercentageConfig {
	enabled: boolean;
	// Show percentage value (e.g., "23%")
	showValue: boolean;
	progressBar: ProgressBarConfig;
}

export interface StatuslineConfig {
	// Display everything on one line (separated by separator) or two lines
	oneLine: boolean;

	// Show model name even when using Sonnet (default model)
	showSonnetModel: boolean;

	// Path display mode:
	// - "full": Show complete path with ~ substitution
	// - "truncated": Show only last 2 segments
	// - "basename": Show only the directory name
	pathDisplayMode: "full" | "truncated" | "basename";

	// Git display configuration
	git: {
		// Enable/disable git display
		enabled: boolean;
		// Show current branch name
		showBranch: boolean;
		// Show * indicator when branch has changes
		showDirtyIndicator: boolean;
		// Show added/deleted lines count
		showChanges: boolean;
		// Show staged files count (gray color)
		showStaged: boolean;
		// Show unstaged files count (yellow color)
		showUnstaged: boolean;
	};

	// Separator character between sections
	// Options: "|", "•", "·", "⋅", "●", "◆", "▪", "▸", "›", "→"
	separator: Separator;

	// Session display configuration
	session: {
		// Separator character between session info (cost, tokens, percentage)
		// Options: "|", "•", "·", "⋅", "●", "◆", "▪", "▸", "›", "→"
		// Use null for single space separator
		infoSeparator: Separator | null;

		// Cost display configuration
		cost: {
			enabled: boolean;
		};

		// Duration display configuration
		duration: {
			enabled: boolean;
		};

		// Tokens display configuration
		tokens: {
			enabled: boolean;
			// Show max tokens (e.g., "192k/200k" vs "192k")
			showMax: boolean;
			// Show decimals in token count (e.g., "192.1k" vs "192k")
			showDecimals: boolean;
		};

		// Context percentage display configuration
		percentage: PercentageConfig;
	};

	// Context display configuration
	context: {
		// Maximum context window size (Claude's hard limit)
		maxContextTokens: number;
		// Autocompact buffer size (reserved for safety)
		autocompactBufferTokens: number;
		// Use only usable context (includes autocompact buffer in display) vs just transcript
		useUsableContextOnly: boolean;
		// Approximate tokens overhead for system (prompts, tools, memory files)
		// Default ~20k includes: system prompts (~3k) + tools (~12k) + memory (~5k)
		// Set to 0 to show only transcript tokens
		overheadTokens: number;
	};

	// Limits display configuration
	limits: {
		// Enable/disable limits display
		enabled: boolean;
		// Show time left until reset
		showTimeLeft: boolean;
		// Show cost for current 5-hour period
		showCost: boolean;

		// Usage percentage display configuration
		percentage: PercentageConfig;
	};

	// Weekly usage limits display configuration
	weeklyUsage: {
		// true: always show, false: never show, "90%": show when 5-hour usage >= 90%
		enabled: boolean | "90%";
		// Show time left until reset
		showTimeLeft: boolean;
		// Show cost for current 7-day period
		showCost: boolean;

		// Usage percentage display configuration
		percentage: PercentageConfig;
	};

	// Daily spend display configuration
	dailySpend: {
		// Enable/disable daily spend display
		enabled: boolean;
	};
}

export const defaultConfig: StatuslineConfig = {
	oneLine: true,
	showSonnetModel: false,
	pathDisplayMode: "truncated",
	git: {
		enabled: true,
		showBranch: true,
		showDirtyIndicator: true,
		showChanges: false,
		showStaged: true,
		showUnstaged: true,
	},
	separator: "•",
	session: {
		infoSeparator: null,
		cost: {
			enabled: true,
		},
		duration: {
			enabled: true,
		},
		tokens: {
			enabled: true,
			showMax: false,
			showDecimals: false,
		},
		percentage: {
			enabled: true,
			showValue: true,
			progressBar: {
				enabled: true,
				length: 10,
				style: "braille",
				color: "progressive",
				background: "none",
			},
		},
	},
	context: {
		maxContextTokens: 200000,
		autocompactBufferTokens: 45000,
		useUsableContextOnly: true,
		overheadTokens: 0,
	},
	limits: {
		enabled: true,
		showTimeLeft: true,
		showCost: false,
		percentage: {
			enabled: true,
			showValue: true,
			progressBar: {
				enabled: true,
				length: 10,
				style: "braille",
				color: "progressive",
				background: "none",
			},
		},
	},
	weeklyUsage: {
		enabled: "90%",
		showTimeLeft: true,
		showCost: false,
		percentage: {
			enabled: true,
			showValue: true,
			progressBar: {
				enabled: true,
				length: 10,
				style: "braille",
				color: "progressive",
				background: "none",
			},
		},
	},
	dailySpend: {
		enabled: true,
	},
};
