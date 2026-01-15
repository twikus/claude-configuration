import { describe, expect, it } from "bun:test";
import {
	buildPrompt,
	createCustomTitleLine,
	extractTextContent,
	isRealUserMessage,
	parseTitle,
} from "../src/shared";

describe("extractTextContent", () => {
	it("should extract text from string content", () => {
		const result = extractTextContent("Hello world");
		expect(result).toBe("Hello world");
	});

	it("should extract text from content blocks array", () => {
		const content = [
			{ type: "thinking", thinking: "I'm thinking..." },
			{ type: "text", text: "This is the response" },
		];
		const result = extractTextContent(content);
		expect(result).toBe("This is the response");
	});

	it("should return empty string when no text block found", () => {
		const content = [{ type: "thinking", thinking: "Just thinking" }];
		const result = extractTextContent(content);
		expect(result).toBe("");
	});

	it("should return empty string for empty array", () => {
		const result = extractTextContent([]);
		expect(result).toBe("");
	});
});

describe("isRealUserMessage", () => {
	it("should return true for valid user messages", () => {
		expect(isRealUserMessage("Help me build a component")).toBe(true);
		expect(isRealUserMessage("Fix the bug in my code")).toBe(true);
	});

	it("should return false for empty content", () => {
		expect(isRealUserMessage("")).toBe(false);
	});

	it("should return false for messages starting with Caveat:", () => {
		expect(isRealUserMessage("Caveat: This is a system message")).toBe(false);
	});

	it("should return false for command messages", () => {
		expect(isRealUserMessage("<command-name>test</command-name>")).toBe(false);
		expect(isRealUserMessage("<local-command>something</local-command>")).toBe(
			false,
		);
	});

	it("should return false for very short messages", () => {
		expect(isRealUserMessage("hey")).toBe(false);
		expect(isRealUserMessage("hi")).toBe(false);
		expect(isRealUserMessage("    ")).toBe(false);
	});

	it("should return true for messages exactly 5 characters", () => {
		expect(isRealUserMessage("hello")).toBe(true);
	});
});

describe("parseTitle", () => {
	it("should parse a clean title", () => {
		expect(parseTitle("Build React Auth")).toBe("Build React Auth");
	});

	it("should remove quotes and special characters", () => {
		expect(parseTitle('"Debug API Error"')).toBe("Debug API Error");
		expect(parseTitle("**Fix Bug**")).toBe("Fix Bug");
		expect(parseTitle("`Code Review`")).toBe("Code Review");
	});

	it("should trim whitespace", () => {
		expect(parseTitle("  Create Component  ")).toBe("Create Component");
	});

	it("should truncate long titles to 60 characters", () => {
		const longTitle =
			"This is a very long title that should be truncated because it exceeds sixty characters";
		const result = parseTitle(longTitle);
		expect(result?.length).toBeLessThanOrEqual(60);
	});

	it("should return null for empty or very short titles", () => {
		expect(parseTitle("")).toBeNull();
		expect(parseTitle("ab")).toBeNull();
		expect(parseTitle("  ")).toBeNull();
	});
});

describe("buildPrompt", () => {
	it("should include user message in prompt", () => {
		const prompt = buildPrompt("Help me fix a bug", "");
		expect(prompt).toContain("Help me fix a bug");
		expect(prompt).toContain("<user_message>");
	});

	it("should include assistant response when provided", () => {
		const prompt = buildPrompt("Fix bug", "I'll help you debug this issue");
		expect(prompt).toContain("<context>");
		expect(prompt).toContain("I'll help you debug this issue");
	});

	it("should not include context section when no assistant response", () => {
		const prompt = buildPrompt("Fix bug", "");
		expect(prompt).not.toContain("<context>");
	});

	it("should truncate long user messages", () => {
		const longMessage = "a".repeat(500);
		const prompt = buildPrompt(longMessage, "");
		expect(prompt).toContain("a".repeat(400));
		expect(prompt).not.toContain("a".repeat(500));
	});
});

describe("createCustomTitleLine", () => {
	it("should create valid JSON with custom-title type", () => {
		const line = createCustomTitleLine("My Title", "session-123");
		const parsed = JSON.parse(line);

		expect(parsed.type).toBe("custom-title");
		expect(parsed.customTitle).toBe("My Title");
		expect(parsed.sessionId).toBe("session-123");
	});
});
