import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { getClaudeCodeToken } from "./helper/credentials";

export {
	getClaudeCodeToken,
	getClaudeCodeTokenSafe,
} from "./helper/credentials";

const SYSTEM_PROMPT =
	"You are Claude Code, Anthropic's official CLI for Claude.";

export type Model = "haiku" | "sonnet" | "opus";

const MODEL_MAP: Record<Model, string> = {
	haiku: "claude-haiku-4-5-20251001",
	sonnet: "claude-sonnet-4-5-20250929",
	opus: "claude-opus-4-5-20251101",
};

export async function generateTextCC({
	prompt,
	system,
	model = "sonnet",
}: {
	prompt: string;
	system?: string;
	model?: Model;
}): Promise<string> {
	const token = await getClaudeCodeToken();

	const anthropic = createAnthropic({
		apiKey: "oauth-token",
		headers: {
			"anthropic-beta":
				"claude-code-20250219,oauth-2025-04-20,interleaved-thinking-2025-05-14",
			"anthropic-dangerous-direct-browser-access": "true",
			"x-app": "cli",
			"User-Agent": "claude-cli/2.0.76 (external, cli)",
		},
		fetch: (async (url: RequestInfo | URL, options?: RequestInit) => {
			const headers = new Headers(options?.headers);
			headers.delete("x-api-key");
			headers.set("Authorization", `Bearer ${token}`);
			return fetch(url, { ...options, headers });
		}) as typeof fetch,
	});

	const result = await generateText({
		model: anthropic(MODEL_MAP[model]),
		system,
		prompt,
	});

	return result.text;
}
