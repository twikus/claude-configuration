export interface ContentBlock {
	type: string;
	text?: string;
	thinking?: string;
}

export interface TranscriptLine {
	type: string;
	message?: {
		role: string;
		content: string | ContentBlock[];
	};
	sessionId?: string;
}

export function extractTextContent(content: string | ContentBlock[]): string {
	if (typeof content === "string") return content;

	for (const block of content) {
		if (block.type === "text" && block.text) return block.text;
	}
	return "";
}

export function isRealUserMessage(content: string): boolean {
	if (!content) return false;
	if (content.startsWith("Caveat:")) return false;
	if (content.startsWith("<command-")) return false;
	if (content.startsWith("<local-command")) return false;
	if (content.trim().length < 5) return false;
	return true;
}

export function buildPrompt(
	userMessage: string,
	assistantResponse: string,
): string {
	return `Generate a short title (2-5 words) for this Claude Code session.

<rules>
- ALWAYS generate a title, never refuse
- Start with a verb (action word)
- Be concise and descriptive
- Always respond in English
</rules>

<examples>
<example>
<user>Help me build a React component for user authentication</user>
<title>Build React Auth Component</title>
</example>
<example>
<user>I'm getting a TypeError when fetching from my API</user>
<title>Debug API TypeError</title>
</example>
<example>
<user>compte jusqu'à 10</user>
<title>Count to Ten</title>
</example>
<example>
<user>what is 2+2</user>
<title>Calculate Simple Math</title>
</example>
<example>
<user>explain how promises work</user>
<title>Explain JavaScript Promises</title>
</example>
<example>
<user>fix the bug in my code</user>
<title>Fix Code Bug</title>
</example>
</examples>

<user_message>
${userMessage.slice(0, 400)}
</user_message>

${assistantResponse ? `<context>\n${assistantResponse.slice(0, 200)}\n</context>` : ""}

Title:`;
}

export function parseTitle(text: string): string | null {
	const title = text
		.trim()
		.replace(/["'\n*_`#]/g, "")
		.slice(0, 60);
	return title && title.length > 2 ? title : null;
}

export function createCustomTitleLine(
	title: string,
	sessionId: string,
): string {
	return JSON.stringify({
		type: "custom-title",
		customTitle: title,
		sessionId: sessionId,
	});
}
