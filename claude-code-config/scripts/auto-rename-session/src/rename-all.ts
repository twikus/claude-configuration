import { isAbsolute, join, sep } from "node:path";
import { generateTextCC } from "../../claude-code-ai/claude";
import { encodeProjectPath } from "../../claude-code-ai/helper";
import {
	buildPrompt,
	createCustomTitleLine,
	extractTextContent,
	isRealUserMessage,
	parseTitle,
	type TranscriptLine,
} from "./shared";

function toClaudeProjectPath(inputPath: string): string {
	const absolutePath = isAbsolute(inputPath)
		? inputPath
		: join(process.cwd(), inputPath);

	return encodeProjectPath(absolutePath);
}

async function main() {
	const args = process.argv.slice(2);
	const override = args.includes("--override");
	const inputPath = args.find((arg) => !arg.startsWith("--"));

	if (!inputPath) {
		console.error("Usage: bun run rename-all <project-path> [--override]");
		console.error("Example: bun run rename-all /Users/melvynx/cc");
		console.error("Example: bun run rename-all . --override");
		console.error("\nFlags:");
		console.error("  --override  Override existing titles");
		process.exit(1);
	}

	const projectPath = toClaudeProjectPath(inputPath);
	console.log(`Session folder: ${projectPath}`);
	console.log(`Override mode: ${override ? "ON" : "OFF"}\n`);

	const glob = new Bun.Glob("*.jsonl");
	const files = await Array.fromAsync(glob.scan({ cwd: projectPath }));

	const sessionFiles = files.filter((f) => !f.startsWith("agent-"));

	console.log(`Found ${sessionFiles.length} sessions in ${projectPath}\n`);

	let renamed = 0;
	let skipped = 0;

	for (const file of sessionFiles) {
		const filePath = join(projectPath, file);
		const content = await Bun.file(filePath).text();
		const lines = content.trim().split("\n");

		let hasCustomTitle = false;
		let firstUserMessage = "";
		let firstAssistantResponse = "";
		let foundUser = false;
		let sessionId = file.replace(".jsonl", "");

		for (const line of lines) {
			try {
				const parsed: TranscriptLine = JSON.parse(line);

				if (parsed.type === "custom-title") {
					hasCustomTitle = true;
					break;
				}

				if (parsed.sessionId) {
					sessionId = parsed.sessionId;
				}

				if (!firstUserMessage && parsed.message?.role === "user") {
					const text = extractTextContent(parsed.message.content);
					if (isRealUserMessage(text)) {
						firstUserMessage = text;
						foundUser = true;
					}
				}

				if (
					foundUser &&
					!firstAssistantResponse &&
					parsed.message?.role === "assistant"
				) {
					const text = extractTextContent(parsed.message.content);
					if (text) {
						firstAssistantResponse = text;
					}
				}
			} catch {}
		}

		if (hasCustomTitle && !override) {
			skipped++;
			continue;
		}

		if (!firstUserMessage) {
			console.log(`⏭️  ${file} - No user message found`);
			skipped++;
			continue;
		}

		try {
			const text = await generateTextCC({
				prompt: buildPrompt(firstUserMessage, firstAssistantResponse),
				model: "haiku",
			});

			const title = parseTitle(text);

			if (title) {
				// If overriding, we need to remove the old custom-title line first
				let finalContent = content;
				if (hasCustomTitle && override) {
					const contentLines = content.trim().split("\n");
					const filteredLines = contentLines.filter((line) => {
						try {
							const parsed = JSON.parse(line);
							return parsed.type !== "custom-title";
						} catch {
							return true;
						}
					});
					finalContent = filteredLines.join("\n") + "\n";
				}

				await Bun.write(
					filePath,
					`${finalContent + createCustomTitleLine(title, sessionId)}\n`,
				);
				const prefix = hasCustomTitle && override ? "🔄" : "✅";
				console.log(`${prefix} ${file} → "${title}"`);
				renamed++;
			} else {
				console.log(`⏭️  ${file} - No meaningful title`);
				skipped++;
			}
		} catch (e) {
			console.error(`❌ ${file} - Error: ${e}`);
		}
	}

	console.log(`\nDone! Renamed: ${renamed}, Skipped: ${skipped}`);
}

main().catch(console.error);
