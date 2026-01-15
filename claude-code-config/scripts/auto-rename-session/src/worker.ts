import { join } from "node:path";
import { generateTextCC } from "../../claude-code-ai/claude";
import { buildPrompt, createCustomTitleLine, parseTitle } from "./shared";

const SCRIPT_DIR = import.meta.dir;
const LOG_FILE = join(SCRIPT_DIR, "..", "debug.log");

async function log(message: string) {
	const timestamp = new Date().toISOString();
	const line = `[${timestamp}] [worker] ${message}\n`;
	await Bun.write(
		LOG_FILE,
		(await Bun.file(LOG_FILE)
			.text()
			.catch(() => "")) + line,
	);
}

const [sessionId, transcriptPath, firstUserMessage, firstAssistantResponse] =
	process.argv.slice(2);

await log(`Worker started: sessionId=${sessionId}`);

if (!sessionId || !transcriptPath || !firstUserMessage) {
	await log("Missing args, exiting");
	process.exit(0);
}

async function main() {
	await log(`firstUserMessage: "${firstUserMessage}"`);
	await log(`firstAssistantResponse: "${firstAssistantResponse}"`);
	await log("Calling Anthropic API...");

	const text = await generateTextCC({
		prompt: buildPrompt(firstUserMessage, firstAssistantResponse),
		model: "haiku",
	});
	await log(`API response: "${text}"`);

	const title = parseTitle(text);

	if (title) {
		await log(`Writing title "${title}" to transcript`);
		const transcriptContent = await Bun.file(transcriptPath).text();
		await Bun.write(
			transcriptPath,
			`${transcriptContent + createCustomTitleLine(title, sessionId)}\n`,
		);
		await log("Title written successfully");
	} else {
		await log(`Skipping: title too short or empty`);
	}
}

main().catch(async (e) => {
	await log(`Worker error: ${e?.message || e}`);
	process.exit(0);
});
