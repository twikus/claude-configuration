#!/usr/bin/env bun
import { Command } from "commander";
import { generateTextCC, type Model } from "./claude";

const program = new Command();

program
	.name("cc-ai")
	.description("CLI to interact with Claude using Claude Code credentials")
	.version("1.0.0");

program
	.command("ask")
	.description("Ask Claude a question")
	.argument("<message>", "The message to send to Claude")
	.option("-m, --model <model>", "Model to use (haiku, sonnet, opus)", "sonnet")
	.option("-s, --system <prompt>", "Custom system prompt")
	.action(async (message: string, options: { model: Model; system?: string }) => {
		const response = await generateTextCC({
			prompt: message,
			model: options.model,
			system: options.system,
		});
		console.log(response);
	});

program.parse();
