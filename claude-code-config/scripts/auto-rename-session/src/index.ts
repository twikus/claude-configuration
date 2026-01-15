import { join } from "node:path";
import {
	extractTextContent,
	isRealUserMessage,
	type TranscriptLine,
} from "./shared";

const SCRIPT_DIR = import.meta.dir;
const LOG_FILE = join(SCRIPT_DIR, "..", "debug.log");

async function log(message: string) {
	const timestamp = new Date().toISOString();
	const line = `[${timestamp}] ${message}\n`;
	await Bun.write(
		LOG_FILE,
		(await Bun.file(LOG_FILE)
			.text()
			.catch(() => "")) + line,
	);
}

interface HookInput {
	session_id: string;
	transcript_path: string;
	hook_event_name: string;
}

async function main() {
	await log("=== Hook triggered ===");

	const input: HookInput = await Bun.stdin.json();
	await log(
		`Input: session_id=${input.session_id}, transcript_path=${input.transcript_path}`,
	);

	if (!input.transcript_path || !input.session_id) {
		await log("Missing transcript_path or session_id, exiting");
		process.exit(0);
	}

	const transcriptContent = await Bun.file(input.transcript_path).text();
	const lines = transcriptContent.trim().split("\n");

	let hasCustomTitle = false;
	let firstUserMessage = "";
	let firstAssistantResponse = "";
	let foundUser = false;

	for (const line of lines) {
		try {
			const parsed: TranscriptLine = JSON.parse(line);

			if (parsed.type === "custom-title") {
				hasCustomTitle = true;
				break;
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

	await log(
		`hasCustomTitle=${hasCustomTitle}, firstUserMessage="${firstUserMessage.slice(0, 50)}..."`,
	);

	if (hasCustomTitle || !firstUserMessage) {
		await log(
			`Skipping: hasCustomTitle=${hasCustomTitle}, noFirstUserMessage=${!firstUserMessage}`,
		);
		process.exit(0);
	}

	await log(`Spawning worker with session_id=${input.session_id}`);

	const workerPath = join(SCRIPT_DIR, "worker.ts");
	Bun.spawn(
		[
			"bun",
			workerPath,
			input.session_id,
			input.transcript_path,
			firstUserMessage.slice(0, 400),
			firstAssistantResponse.slice(0, 300),
		],
		{
			stdio: ["ignore", "ignore", "ignore"],
		},
	);

	await log("Worker spawned successfully");
}

main().catch(async (e) => {
	await log(`Main error: ${e?.message || e}`);
	process.exit(0);
});
