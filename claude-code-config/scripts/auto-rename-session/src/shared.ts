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

	// Detect skill/workflow prompt expansions - these are NOT real user messages
	if (content.startsWith("Base directory for this skill:")) return false;
	if (content.includes("<objective>")) return false;
	if (content.includes("<quick_start>")) return false;
	if (content.includes("<parameters>")) return false;
	if (content.includes("<workflow>")) return false;
	if (content.includes("<step_files>")) return false;
	if (content.includes("<execution_rules>")) return false;

	return true;
}

export function buildPrompt(
	userMessage: string,
	assistantResponse: string,
): string {
	return `Generate a short title (2-5 words) for this Claude Code session.

<rules>
- Start with a verb (action word)
- Be concise and descriptive
- Always respond in English
- CRITICAL: Focus ONLY on the user's ORIGINAL INTENT from their message
- NEVER include workflow names, tool names, skill names, or methodology references in the title
- The title should describe WHAT the user wants to accomplish, not HOW (not the method/tool used)
- If the user's message mentions a workflow/skill, extract the actual goal behind it
- If the user intent is UNCLEAR or you can only see workflow/skill instructions, respond with exactly: None
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
<example>
<user>Base directory for this skill: /path/to/skill... [skill prompt]</user>
<title>None</title>
</example>
<example>
<user><objective>Execute systematic implementation workflows...</objective></user>
<title>None</title>
</example>
</examples>

<user_message>
${userMessage.slice(0, 400)}
</user_message>

${assistantResponse ? `<context>\n${assistantResponse.slice(0, 200)}\n</context>` : ""}

IMPORTANT: Extract the user's actual goal from their message. If the message is a workflow/skill prompt or system instruction (not a real user request), respond with exactly "None".

Title:`;
}

export function parseTitle(text: string): string | null {
	const title = text
		.trim()
		.replace(/["'\n*_`#]/g, "")
		.slice(0, 60);

	if (!title || title.length <= 2) return null;

	// Return null for "None" responses (intent unclear)
	if (title.toLowerCase() === "none") return null;

	// Filter out ANY title containing workflow/skill keywords - these are NOT user intent
	const forbiddenKeywords = [
		"apex",
		"workflow",
		"skill",
		"brainstorm",
		"subagent",
		"hook",
	];

	const lowerTitle = title.toLowerCase();
	for (const keyword of forbiddenKeywords) {
		if (lowerTitle.includes(keyword)) return null;
	}

	return title;
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
