#!/usr/bin/env bun

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { StatuslineConfig } from "../../statusline.config";
import { defaultConfig } from "../../statusline.config";
import { colors } from "../lib/formatters";
import { renderStatusline } from "../lib/renderer";
import type { HookInput } from "../lib/types";

const CONFIG_FILE_PATH = join(
	import.meta.dir,
	"..",
	"..",
	"statusline.config.json",
);

interface MenuOption {
	path: string;
	label: string;
	type: "boolean" | "cycle" | "section";
	getValue?: (config: StatuslineConfig) => boolean | string;
	toggle?: (config: StatuslineConfig) => void;
	cycle?: (config: StatuslineConfig, direction: 1 | -1) => void;
	choices?: string[];
	indent?: number;
	hidden?: (config: StatuslineConfig) => boolean;
}

const menuOptions: MenuOption[] = [
	// SESSION SECTION
	{
		path: "session.header",
		label: "SESSION",
		type: "section",
	},
	{
		path: "session.cost",
		label: "Cost display",
		type: "boolean",
		getValue: (c) => c.session.cost.enabled,
		toggle: (c) => {
			c.session.cost.enabled = !c.session.cost.enabled;
		},
		indent: 1,
	},
	{
		path: "session.duration",
		label: "Duration display",
		type: "boolean",
		getValue: (c) => c.session.duration.enabled,
		toggle: (c) => {
			c.session.duration.enabled = !c.session.duration.enabled;
		},
		indent: 1,
	},
	{
		path: "session.tokens",
		label: "Tokens count",
		type: "boolean",
		getValue: (c) => c.session.tokens.enabled,
		toggle: (c) => {
			c.session.tokens.enabled = !c.session.tokens.enabled;
		},
		indent: 1,
	},
	{
		path: "session.tokens.showMax",
		label: "Show max (192k/200k)",
		type: "boolean",
		getValue: (c) => c.session.tokens.showMax,
		toggle: (c) => {
			c.session.tokens.showMax = !c.session.tokens.showMax;
		},
		indent: 2,
		hidden: (c) => !c.session.tokens.enabled,
	},
	{
		path: "session.tokens.showDecimals",
		label: "Show decimals (192.5k)",
		type: "boolean",
		getValue: (c) => c.session.tokens.showDecimals,
		toggle: (c) => {
			c.session.tokens.showDecimals = !c.session.tokens.showDecimals;
		},
		indent: 2,
		hidden: (c) => !c.session.tokens.enabled,
	},
	{
		path: "session.percentage",
		label: "Context percentage",
		type: "boolean",
		getValue: (c) => c.session.percentage.enabled,
		toggle: (c) => {
			c.session.percentage.enabled = !c.session.percentage.enabled;
		},
		indent: 1,
	},
	{
		path: "session.percentage.showValue",
		label: "Show percentage value",
		type: "boolean",
		getValue: (c) => c.session.percentage.showValue,
		toggle: (c) => {
			c.session.percentage.showValue = !c.session.percentage.showValue;
		},
		indent: 2,
		hidden: (c) => !c.session.percentage.enabled,
	},
	{
		path: "session.percentage.progressBar",
		label: "Progress bar",
		type: "boolean",
		getValue: (c) => c.session.percentage.progressBar.enabled,
		toggle: (c) => {
			c.session.percentage.progressBar.enabled =
				!c.session.percentage.progressBar.enabled;
		},
		indent: 2,
		hidden: (c) => !c.session.percentage.enabled,
	},
	{
		path: "session.percentage.progressBar.style",
		label: "Style",
		type: "cycle",
		choices: ["filled", "rectangle", "braille"],
		getValue: (c) => c.session.percentage.progressBar.style,
		cycle: (c, dir) => {
			const styles = ["filled", "rectangle", "braille"] as const;
			const current = styles.indexOf(c.session.percentage.progressBar.style);
			const next = (current + dir + styles.length) % styles.length;
			c.session.percentage.progressBar.style = styles[next];
		},
		indent: 3,
		hidden: (c) =>
			!c.session.percentage.enabled ||
			!c.session.percentage.progressBar.enabled,
	},
	{
		path: "session.percentage.progressBar.length",
		label: "Length",
		type: "cycle",
		choices: ["5", "10", "15"],
		getValue: (c) => c.session.percentage.progressBar.length.toString(),
		cycle: (c, dir) => {
			const lengths = [5, 10, 15] as const;
			const current = lengths.indexOf(c.session.percentage.progressBar.length);
			const next = (current + dir + lengths.length) % lengths.length;
			c.session.percentage.progressBar.length = lengths[next];
		},
		indent: 3,
		hidden: (c) =>
			!c.session.percentage.enabled ||
			!c.session.percentage.progressBar.enabled,
	},
	{
		path: "session.percentage.progressBar.color",
		label: "Color",
		type: "cycle",
		choices: ["progressive", "green", "yellow", "red"],
		getValue: (c) => c.session.percentage.progressBar.color,
		cycle: (c, dir) => {
			const colors = ["progressive", "green", "yellow", "red"] as const;
			const current = colors.indexOf(c.session.percentage.progressBar.color);
			const next = (current + dir + colors.length) % colors.length;
			c.session.percentage.progressBar.color = colors[next];
		},
		indent: 3,
		hidden: (c) =>
			!c.session.percentage.enabled ||
			!c.session.percentage.progressBar.enabled,
	},
	{
		path: "session.percentage.progressBar.background",
		label: "Background",
		type: "cycle",
		choices: ["none", "dark", "gray", "light", "blue", "purple", "cyan"],
		getValue: (c) => c.session.percentage.progressBar.background,
		cycle: (c, dir) => {
			const backgrounds = [
				"none",
				"dark",
				"gray",
				"light",
				"blue",
				"purple",
				"cyan",
			] as const;
			const current = backgrounds.indexOf(
				c.session.percentage.progressBar.background,
			);
			const next = (current + dir + backgrounds.length) % backgrounds.length;
			c.session.percentage.progressBar.background = backgrounds[next];
		},
		indent: 3,
		hidden: (c) =>
			!c.session.percentage.enabled ||
			!c.session.percentage.progressBar.enabled,
	},
	{
		path: "context.useUsableContextOnly",
		label: "Add 45k auto-compact buffer",
		type: "boolean",
		getValue: (c) => c.context.useUsableContextOnly,
		toggle: (c) => {
			c.context.useUsableContextOnly = !c.context.useUsableContextOnly;
		},
		indent: 1,
	},

	// LIMITS SECTION
	{
		path: "limits.header",
		label: "5-HOUR LIMITS",
		type: "section",
		getValue: (c) => c.limits.enabled,
		toggle: (c) => {
			c.limits.enabled = !c.limits.enabled;
		},
	},
	{
		path: "limits.showTimeLeft",
		label: "Show time left",
		type: "boolean",
		getValue: (c) => c.limits.showTimeLeft,
		toggle: (c) => {
			c.limits.showTimeLeft = !c.limits.showTimeLeft;
		},
		indent: 1,
		hidden: (c) => !c.limits.enabled,
	},
	{
		path: "limits.showCost",
		label: "Show cost",
		type: "boolean",
		getValue: (c) => c.limits.showCost,
		toggle: (c) => {
			c.limits.showCost = !c.limits.showCost;
		},
		indent: 1,
		hidden: (c) => !c.limits.enabled,
	},
	{
		path: "limits.percentage",
		label: "Percentage display",
		type: "boolean",
		getValue: (c) => c.limits.percentage.enabled,
		toggle: (c) => {
			c.limits.percentage.enabled = !c.limits.percentage.enabled;
		},
		indent: 1,
		hidden: (c) => !c.limits.enabled,
	},
	{
		path: "limits.percentage.showValue",
		label: "Show percentage value",
		type: "boolean",
		getValue: (c) => c.limits.percentage.showValue,
		toggle: (c) => {
			c.limits.percentage.showValue = !c.limits.percentage.showValue;
		},
		indent: 2,
		hidden: (c) => !c.limits.enabled || !c.limits.percentage.enabled,
	},
	{
		path: "limits.percentage.progressBar",
		label: "Progress bar",
		type: "boolean",
		getValue: (c) => c.limits.percentage.progressBar.enabled,
		toggle: (c) => {
			c.limits.percentage.progressBar.enabled =
				!c.limits.percentage.progressBar.enabled;
		},
		indent: 2,
		hidden: (c) => !c.limits.enabled || !c.limits.percentage.enabled,
	},
	{
		path: "limits.percentage.progressBar.style",
		label: "Style",
		type: "cycle",
		choices: ["filled", "rectangle", "braille"],
		getValue: (c) => c.limits.percentage.progressBar.style,
		cycle: (c, dir) => {
			const styles = ["filled", "rectangle", "braille"] as const;
			const current = styles.indexOf(c.limits.percentage.progressBar.style);
			const next = (current + dir + styles.length) % styles.length;
			c.limits.percentage.progressBar.style = styles[next];
		},
		indent: 3,
		hidden: (c) =>
			!c.limits.enabled ||
			!c.limits.percentage.enabled ||
			!c.limits.percentage.progressBar.enabled,
	},
	{
		path: "limits.percentage.progressBar.length",
		label: "Length",
		type: "cycle",
		choices: ["5", "10", "15"],
		getValue: (c) => c.limits.percentage.progressBar.length.toString(),
		cycle: (c, dir) => {
			const lengths = [5, 10, 15] as const;
			const current = lengths.indexOf(c.limits.percentage.progressBar.length);
			const next = (current + dir + lengths.length) % lengths.length;
			c.limits.percentage.progressBar.length = lengths[next];
		},
		indent: 3,
		hidden: (c) =>
			!c.limits.enabled ||
			!c.limits.percentage.enabled ||
			!c.limits.percentage.progressBar.enabled,
	},
	{
		path: "limits.percentage.progressBar.color",
		label: "Color",
		type: "cycle",
		choices: ["progressive", "green", "yellow", "red"],
		getValue: (c) => c.limits.percentage.progressBar.color,
		cycle: (c, dir) => {
			const colors = ["progressive", "green", "yellow", "red"] as const;
			const current = colors.indexOf(c.limits.percentage.progressBar.color);
			const next = (current + dir + colors.length) % colors.length;
			c.limits.percentage.progressBar.color = colors[next];
		},
		indent: 3,
		hidden: (c) =>
			!c.limits.enabled ||
			!c.limits.percentage.enabled ||
			!c.limits.percentage.progressBar.enabled,
	},
	{
		path: "limits.percentage.progressBar.background",
		label: "Background",
		type: "cycle",
		choices: ["none", "dark", "gray", "light", "blue", "purple", "cyan"],
		getValue: (c) => c.limits.percentage.progressBar.background,
		cycle: (c, dir) => {
			const backgrounds = [
				"none",
				"dark",
				"gray",
				"light",
				"blue",
				"purple",
				"cyan",
			] as const;
			const current = backgrounds.indexOf(
				c.limits.percentage.progressBar.background,
			);
			const next = (current + dir + backgrounds.length) % backgrounds.length;
			c.limits.percentage.progressBar.background = backgrounds[next];
		},
		indent: 3,
		hidden: (c) =>
			!c.limits.enabled ||
			!c.limits.percentage.enabled ||
			!c.limits.percentage.progressBar.enabled,
	},

	// WEEKLY SECTION
	{
		path: "weekly.header",
		label: "WEEKLY LIMITS",
		type: "section",
		getValue: (c) =>
			typeof c.weeklyUsage.enabled === "boolean" ? c.weeklyUsage.enabled : true,
		toggle: (c) => {
			if (typeof c.weeklyUsage.enabled === "boolean") {
				c.weeklyUsage.enabled = !c.weeklyUsage.enabled;
			} else {
				c.weeklyUsage.enabled = false;
			}
		},
	},
	{
		path: "weeklyUsage.enabled.mode",
		label: "Display mode",
		type: "cycle",
		choices: ["true", "false", "90%"],
		getValue: (c) => {
			if (typeof c.weeklyUsage.enabled === "boolean") {
				return c.weeklyUsage.enabled ? "true" : "false";
			}
			return c.weeklyUsage.enabled;
		},
		cycle: (c, dir) => {
			const modes = [true, false, "90%"] as const;
			const currentValue = c.weeklyUsage.enabled;
			const currentIndex =
				currentValue === true ? 0 : currentValue === false ? 1 : 2;
			const next = (currentIndex + dir + modes.length) % modes.length;
			c.weeklyUsage.enabled = modes[next];
		},
		indent: 1,
	},
	{
		path: "weeklyUsage.showTimeLeft",
		label: "Show time left",
		type: "boolean",
		getValue: (c) => c.weeklyUsage.showTimeLeft,
		toggle: (c) => {
			c.weeklyUsage.showTimeLeft = !c.weeklyUsage.showTimeLeft;
		},
		indent: 1,
		hidden: (c) => c.weeklyUsage.enabled === false,
	},
	{
		path: "weeklyUsage.showCost",
		label: "Show cost",
		type: "boolean",
		getValue: (c) => c.weeklyUsage.showCost,
		toggle: (c) => {
			c.weeklyUsage.showCost = !c.weeklyUsage.showCost;
		},
		indent: 1,
		hidden: (c) => c.weeklyUsage.enabled === false,
	},
	{
		path: "weeklyUsage.percentage",
		label: "Percentage display",
		type: "boolean",
		getValue: (c) => c.weeklyUsage.percentage.enabled,
		toggle: (c) => {
			c.weeklyUsage.percentage.enabled = !c.weeklyUsage.percentage.enabled;
		},
		indent: 1,
		hidden: (c) => c.weeklyUsage.enabled === false,
	},
	{
		path: "weeklyUsage.percentage.showValue",
		label: "Show percentage value",
		type: "boolean",
		getValue: (c) => c.weeklyUsage.percentage.showValue,
		toggle: (c) => {
			c.weeklyUsage.percentage.showValue = !c.weeklyUsage.percentage.showValue;
		},
		indent: 2,
		hidden: (c) =>
			c.weeklyUsage.enabled === false || !c.weeklyUsage.percentage.enabled,
	},
	{
		path: "weeklyUsage.percentage.progressBar",
		label: "Progress bar",
		type: "boolean",
		getValue: (c) => c.weeklyUsage.percentage.progressBar.enabled,
		toggle: (c) => {
			c.weeklyUsage.percentage.progressBar.enabled =
				!c.weeklyUsage.percentage.progressBar.enabled;
		},
		indent: 2,
		hidden: (c) =>
			c.weeklyUsage.enabled === false || !c.weeklyUsage.percentage.enabled,
	},
	{
		path: "weeklyUsage.percentage.progressBar.style",
		label: "Style",
		type: "cycle",
		choices: ["filled", "rectangle", "braille"],
		getValue: (c) => c.weeklyUsage.percentage.progressBar.style,
		cycle: (c, dir) => {
			const styles = ["filled", "rectangle", "braille"] as const;
			const current = styles.indexOf(
				c.weeklyUsage.percentage.progressBar.style,
			);
			const next = (current + dir + styles.length) % styles.length;
			c.weeklyUsage.percentage.progressBar.style = styles[next];
		},
		indent: 3,
		hidden: (c) =>
			c.weeklyUsage.enabled === false ||
			!c.weeklyUsage.percentage.enabled ||
			!c.weeklyUsage.percentage.progressBar.enabled,
	},
	{
		path: "weeklyUsage.percentage.progressBar.length",
		label: "Length",
		type: "cycle",
		choices: ["5", "10", "15"],
		getValue: (c) => c.weeklyUsage.percentage.progressBar.length.toString(),
		cycle: (c, dir) => {
			const lengths = [5, 10, 15] as const;
			const current = lengths.indexOf(
				c.weeklyUsage.percentage.progressBar.length,
			);
			const next = (current + dir + lengths.length) % lengths.length;
			c.weeklyUsage.percentage.progressBar.length = lengths[next];
		},
		indent: 3,
		hidden: (c) =>
			c.weeklyUsage.enabled === false ||
			!c.weeklyUsage.percentage.enabled ||
			!c.weeklyUsage.percentage.progressBar.enabled,
	},
	{
		path: "weeklyUsage.percentage.progressBar.color",
		label: "Color",
		type: "cycle",
		choices: ["progressive", "green", "yellow", "red"],
		getValue: (c) => c.weeklyUsage.percentage.progressBar.color,
		cycle: (c, dir) => {
			const colors = ["progressive", "green", "yellow", "red"] as const;
			const current = colors.indexOf(
				c.weeklyUsage.percentage.progressBar.color,
			);
			const next = (current + dir + colors.length) % colors.length;
			c.weeklyUsage.percentage.progressBar.color = colors[next];
		},
		indent: 3,
		hidden: (c) =>
			c.weeklyUsage.enabled === false ||
			!c.weeklyUsage.percentage.enabled ||
			!c.weeklyUsage.percentage.progressBar.enabled,
	},
	{
		path: "weeklyUsage.percentage.progressBar.background",
		label: "Background",
		type: "cycle",
		choices: ["none", "dark", "gray", "light", "blue", "purple", "cyan"],
		getValue: (c) => c.weeklyUsage.percentage.progressBar.background,
		cycle: (c, dir) => {
			const backgrounds = [
				"none",
				"dark",
				"gray",
				"light",
				"blue",
				"purple",
				"cyan",
			] as const;
			const current = backgrounds.indexOf(
				c.weeklyUsage.percentage.progressBar.background,
			);
			const next = (current + dir + backgrounds.length) % backgrounds.length;
			c.weeklyUsage.percentage.progressBar.background = backgrounds[next];
		},
		indent: 3,
		hidden: (c) =>
			c.weeklyUsage.enabled === false ||
			!c.weeklyUsage.percentage.enabled ||
			!c.weeklyUsage.percentage.progressBar.enabled,
	},

	// GIT SECTION
	{
		path: "git.header",
		label: "GIT",
		type: "section",
		getValue: (c) => c.git.enabled,
		toggle: (c) => {
			c.git.enabled = !c.git.enabled;
		},
	},
	{
		path: "git.showBranch",
		label: "Show branch",
		type: "boolean",
		getValue: (c) => c.git.showBranch,
		toggle: (c) => {
			c.git.showBranch = !c.git.showBranch;
		},
		indent: 1,
		hidden: (c) => !c.git.enabled,
	},
	{
		path: "git.showDirtyIndicator",
		label: "Show dirty indicator (*)",
		type: "boolean",
		getValue: (c) => c.git.showDirtyIndicator,
		toggle: (c) => {
			c.git.showDirtyIndicator = !c.git.showDirtyIndicator;
		},
		indent: 1,
		hidden: (c) => !c.git.enabled,
	},
	{
		path: "git.showChanges",
		label: "Show line changes (+33 -44)",
		type: "boolean",
		getValue: (c) => c.git.showChanges,
		toggle: (c) => {
			c.git.showChanges = !c.git.showChanges;
		},
		indent: 1,
		hidden: (c) => !c.git.enabled,
	},
	{
		path: "git.showStaged",
		label: "Show staged files count",
		type: "boolean",
		getValue: (c) => c.git.showStaged,
		toggle: (c) => {
			c.git.showStaged = !c.git.showStaged;
		},
		indent: 1,
		hidden: (c) => !c.git.enabled,
	},
	{
		path: "git.showUnstaged",
		label: "Show unstaged files count",
		type: "boolean",
		getValue: (c) => c.git.showUnstaged,
		toggle: (c) => {
			c.git.showUnstaged = !c.git.showUnstaged;
		},
		indent: 1,
		hidden: (c) => !c.git.enabled,
	},

	// DAILY SPEND SECTION
	{
		path: "dailySpend.header",
		label: "DAILY SPEND",
		type: "section",
		getValue: (c) => c.dailySpend.enabled,
		toggle: (c) => {
			c.dailySpend.enabled = !c.dailySpend.enabled;
		},
	},

	// GLOBAL SECTION
	{
		path: "global.header",
		label: "GLOBAL",
		type: "section",
	},
	{
		path: "separator",
		label: "Separator",
		type: "cycle",
		choices: ["|", "•", "·", "⋅", "●", "◆", "▪", "▸", "›", "→"],
		getValue: (c) => c.separator,
		cycle: (c, dir) => {
			const seps = ["|", "•", "·", "⋅", "●", "◆", "▪", "▸", "›", "→"] as const;
			const current = seps.indexOf(c.separator);
			const next = (current + dir + seps.length) % seps.length;
			c.separator = seps[next];
		},
		indent: 1,
	},
	{
		path: "pathDisplayMode",
		label: "Path display",
		type: "cycle",
		choices: ["truncated", "basename", "full"],
		getValue: (c) => c.pathDisplayMode,
		cycle: (c, dir) => {
			const modes = ["truncated", "basename", "full"] as const;
			const current = modes.indexOf(c.pathDisplayMode);
			const next = (current + dir + modes.length) % modes.length;
			c.pathDisplayMode = modes[next];
		},
		indent: 1,
	},
	{
		path: "showSonnetModel",
		label: "Show model when Sonnet",
		type: "boolean",
		getValue: (c) => c.showSonnetModel,
		toggle: (c) => {
			c.showSonnetModel = !c.showSonnetModel;
		},
		indent: 1,
	},
];

async function loadFixture(): Promise<HookInput> {
	const projectRoot = join(import.meta.dir, "..", "..");
	const fixturePath = join(projectRoot, "fixtures", "test-input.json");
	const content = await readFile(fixturePath, "utf-8");
	return JSON.parse(content);
}

async function loadConfig(): Promise<StatuslineConfig> {
	try {
		const content = await readFile(CONFIG_FILE_PATH, "utf-8");
		return JSON.parse(content);
	} catch {
		return JSON.parse(JSON.stringify(defaultConfig));
	}
}

async function saveConfig(config: StatuslineConfig): Promise<void> {
	await writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), "utf-8");
}

function renderMenu(config: StatuslineConfig, selectedIndex: number): string {
	let output = "";
	const visibleOptions = menuOptions.filter(
		(opt) => !opt.hidden || !opt.hidden(config),
	);

	visibleOptions.forEach((option, visIndex) => {
		const actualIndex = menuOptions.indexOf(option);
		const isSelected = actualIndex === selectedIndex;
		const indent = "  ".repeat(option.indent ?? 0);

		if (option.type === "section") {
			if (visIndex > 0) output += "\n";

			if (option.getValue && option.toggle) {
				const value = option.getValue(config);
				const status = value ? colors.green("ON") : colors.red("OFF");
				const cursor = isSelected ? `${colors.yellow("❯ ")}` : "  ";
				const labelColor = isSelected ? colors.yellow : colors.purple;
				output += `${cursor}${labelColor(`▌${option.label}`)} ${colors.gray("[")}${status}${colors.gray("]")}\n`;
			} else {
				const labelColor = colors.purple;
				output += `  ${labelColor(`▌${option.label}`)}\n`;
			}
			return;
		}

		const value = option.getValue?.(config);
		let display = "";

		if (option.type === "boolean") {
			const checkbox = value ? colors.green("☑") : colors.gray("☐");
			display = `${checkbox} ${option.label}`;
		} else if (option.type === "cycle") {
			display = `${option.label} ${colors.gray("[")}${colors.yellow(value as string)}${colors.gray("]")}`;
		}

		const cursor = isSelected ? colors.yellow("›") : " ";
		const color = colors.lightGray;

		const arrows =
			isSelected && option.type === "cycle" ? ` ${colors.gray("←→")}` : "";

		output += `${cursor} ${color(`${indent}${display}`)}${arrows}\n`;
	});

	return output;
}

async function waitForKeypress(): Promise<string> {
	return new Promise((resolve) => {
		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.once("data", (data) => {
			const key = data.toString();
			resolve(key);
		});
	});
}

async function main() {
	console.clear();

	const fixture = await loadFixture();
	let config: StatuslineConfig = await loadConfig();

	const selectableOptions = menuOptions.filter((opt) => {
		if (opt.type === "section" && !opt.toggle) return false;
		return true;
	});
	let selectedIndex = menuOptions.indexOf(selectableOptions[0]);

	process.stdout.write("\x1b[?25l");

	while (true) {
		const { output: combined } = await renderStatusline(fixture, config);

		const menu = renderMenu(config, selectedIndex);

		const output = [
			colors.purple("━━━ PREVIEW"),
			combined,
			"",
			menu,
			colors.gray(
				"↑↓ navigate · space toggle · ←→ cycle · s save · r reset · q quit",
			),
		].join("\n");

		process.stdout.write("\x1b[2J");
		process.stdout.write("\x1b[H");
		process.stdout.write(output);

		const key = await waitForKeypress();

		const selectableOptions = menuOptions.filter((opt) => {
			if (opt.hidden?.(config)) return false;
			if (opt.type === "section" && !opt.toggle) return false;
			return true;
		});
		const selectableIndices = selectableOptions.map((opt) =>
			menuOptions.indexOf(opt),
		);

		if (key === "\u001b[A" || key === "k") {
			const currentPos = selectableIndices.indexOf(selectedIndex);
			if (currentPos > 0) {
				selectedIndex = selectableIndices[currentPos - 1];
			} else if (currentPos === -1 && selectableIndices.length > 0) {
				selectedIndex = selectableIndices[0];
			}
		} else if (key === "\u001b[B" || key === "j") {
			const currentPos = selectableIndices.indexOf(selectedIndex);
			if (currentPos < selectableIndices.length - 1) {
				selectedIndex = selectableIndices[currentPos + 1];
			} else if (currentPos === -1 && selectableIndices.length > 0) {
				selectedIndex = selectableIndices[0];
			}
		} else if (key === " ") {
			const option = menuOptions[selectedIndex];
			if (option.toggle) {
				option.toggle(config);
			}
		} else if (key === "\u001b[C" || key === "l") {
			const option = menuOptions[selectedIndex];
			if (option.type === "cycle" && option.cycle) {
				option.cycle(config, 1);
			}
		} else if (key === "\u001b[D" || key === "h") {
			const option = menuOptions[selectedIndex];
			if (option.type === "cycle" && option.cycle) {
				option.cycle(config, -1);
			}
		} else if (key.toLowerCase() === "r") {
			config = JSON.parse(JSON.stringify(defaultConfig));
		} else if (key.toLowerCase() === "s") {
			await saveConfig(config);
			process.stdout.write("\x1b[2J");
			process.stdout.write("\x1b[H");
			console.log(colors.green(`✓ Configuration saved to ${CONFIG_FILE_PATH}`));
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} else if (key.toLowerCase() === "q" || key === "\u0003") {
			await saveConfig(config);
			process.stdin.setRawMode(false);
			process.stdin.pause();
			process.stdout.write("\x1b[?25h");
			console.clear();
			console.log(
				`${colors.green("✓ Configuration saved! Thanks for exploring!")}\n`,
			);
			process.exit(0);
		}
	}
}

main();
