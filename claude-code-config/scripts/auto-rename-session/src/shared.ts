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
- CRITICAL: Focus ONLY on the user's ORIGINAL INTENT from their message
- IGNORE workflow names, tool names, or methodology references (APEX, brainstorm, workflow, etc.)
- The title should describe WHAT the user wants to accomplish, not HOW (not the method/tool used)
- If the user's message mentions a workflow/skill, extract the actual goal behind it
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
<example>
<user>implement workflow conditions for ralph</user>
<title>Implement Ralph Conditions</title>
</example>
<example>
<user>/apex add dark mode toggle</user>
<title>Add Dark Mode Toggle</title>
</example>
<example>
<user>run /apex to refactor the authentication system</user>
<title>Refactor Auth System</title>
</example>
</examples>

<user_message>
${userMessage.slice(0, 400)}
</user_message>

${assistantResponse ? `<context>\n${assistantResponse.slice(0, 200)}\n</context>` : ""}

IMPORTANT: Extract the user's actual goal from their message. Ignore any workflow or tool names (APEX, brainstorm, etc.) and focus on what they want to accomplish.

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
