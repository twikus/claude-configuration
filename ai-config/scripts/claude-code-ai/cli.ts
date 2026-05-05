#!/usr/bin/env bun
import { parseArgs } from "util";
import { generateTextCC, type Model } from "./claude";

const { values, positionals } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		model: {
			type: "string",
			short: "m",
			default: "sonnet",
		},
		system: {
			type: "string",
			short: "s",
		},
	},
	allowPositionals: true,
});

const prompt = positionals.join(" ");

if (!prompt) {
	console.error(
		"Usage: bun run cli.ts <prompt> [-m opus|sonnet|haiku] [-s system_prompt]",
	);
	process.exit(1);
}

const model = values.model as Model;
if (!["haiku", "sonnet", "opus"].includes(model)) {
	console.error(`Invalid model: ${model}. Use: opus, sonnet, or haiku`);
	process.exit(1);
}

try {
	const response = await generateTextCC({
		prompt,
		model,
		system: values.system,
	});
	console.log(response);
} catch (error) {
	console.error("Error:", error);
	process.exit(1);
}
