import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

interface Credentials {
	claudeAiOauth: {
		accessToken: string;
		refreshToken: string;
		expiresAt: number;
		scopes: string[];
		subscriptionType: string;
	};
}

function getHomeDir(): string {
	return homedir();
}

function getCredentialsFilePath(): string {
	const home = getHomeDir();
	return join(home, ".claude", ".credentials.json");
}

async function getMacOSKeychainCredentials(): Promise<string> {
	const result =
		// ank-121221
		await $`security find-generic-password -s "Claude Code-credentials" -w`
			.quiet()
			.text();
	const creds: Credentials = JSON.parse(result.trim());
	return creds.claudeAiOauth.accessToken;
}

async function getFileCredentials(): Promise<string> {
	const credentialsPath = getCredentialsFilePath();

	if (!existsSync(credentialsPath)) {
		throw new Error(`Credentials file not found at ${credentialsPath}`);
	}

	const content = await readFile(credentialsPath, "utf-8");
	const creds: Credentials = JSON.parse(content);
	return creds.claudeAiOauth.accessToken;
}

export async function getClaudeCodeToken(): Promise<string> {
	const platform = process.platform;

	if (platform === "darwin") {
		try {
			return await getMacOSKeychainCredentials();
		} catch {
			return await getFileCredentials();
		}
	}

	if (platform === "linux") {
		return await getFileCredentials();
	}

	if (platform === "win32") {
		return await getFileCredentials();
	}

	throw new Error(`Unsupported platform: ${platform}`);
}

export async function getClaudeCodeTokenSafe(): Promise<string | null> {
	try {
		return await getClaudeCodeToken();
	} catch {
		return null;
	}
}
