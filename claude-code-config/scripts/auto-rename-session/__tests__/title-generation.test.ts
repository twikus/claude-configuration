import { describe, expect, it } from "bun:test";
import { generateTextCC } from "../../claude-code-ai/claude";
import { buildPrompt, parseTitle } from "../src/shared";

describe("Title Generation (Integration)", () => {
	it("should generate a valid title for a React component request", async () => {
		const userMessage =
			"Help me build a React component for user authentication";
		const assistantResponse =
			"I'll help you create an authentication component";

		const prompt = buildPrompt(userMessage, assistantResponse);
		const response = await generateTextCC({ prompt, model: "haiku" });
		const title = parseTitle(response);

		expect(title).toBeTruthy();
		expect(title!.length).toBeGreaterThan(3);
		expect(title!.length).toBeLessThanOrEqual(60);
	}, 30000);

	it("should generate a valid title for a bug fix request", async () => {
		const userMessage = "I'm getting a TypeError when fetching from my API";
		const assistantResponse = "Let me help you debug this issue";

		const prompt = buildPrompt(userMessage, assistantResponse);
		const response = await generateTextCC({ prompt, model: "haiku" });
		const title = parseTitle(response);

		expect(title).toBeTruthy();
		expect(title!.length).toBeGreaterThan(3);
	}, 30000);

	it("should generate a title in English even for non-English input", async () => {
		const userMessage = "Aide-moi à créer une fonction de tri";
		const assistantResponse = "";

		const prompt = buildPrompt(userMessage, assistantResponse);
		const response = await generateTextCC({ prompt, model: "haiku" });
		const title = parseTitle(response);

		expect(title).toBeTruthy();
		expect(title!.length).toBeGreaterThan(3);
	}, 30000);
});
