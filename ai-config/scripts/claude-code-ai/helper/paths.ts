import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function getHomeDir(): string {
	return homedir();
}

export function getClaudeConfigDir(): string {
	const home = getHomeDir();

	const newPath = join(home, ".config", "claude");
	if (existsSync(newPath)) {
		return newPath;
	}

	const legacyPath = join(home, ".claude");
	if (existsSync(legacyPath)) {
		return legacyPath;
	}

	return newPath;
}

export function getClaudeCredentialsPath(): string {
	const home = getHomeDir();
	return join(home, ".claude", ".credentials.json");
}

export function getClaudeSettingsPath(): string {
	return join(getClaudeConfigDir(), "settings.json");
}

export function getClaudeProjectsDir(): string {
	return join(getClaudeConfigDir(), "projects");
}

export function encodeProjectPath(absolutePath: string): string {
	const normalizedPath = absolutePath.replace(/[/\\]+$/, "");

	const claudeProjectsDir = getClaudeProjectsDir();
	if (normalizedPath.includes(join(".claude", "projects"))) {
		return normalizedPath;
	}

	const encoded = normalizedPath
		.replace(/[/\\]/g, "-")
		.replace(/\./g, "-")
		.replace(/:/g, "");
	return join(claudeProjectsDir, encoded);
}
