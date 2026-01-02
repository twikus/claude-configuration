import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { homedir, platform } from "node:os";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface UsageLimits {
	five_hour: {
		utilization: number;
		resets_at: string | null;
	} | null;
	seven_day: {
		utilization: number;
		resets_at: string | null;
	} | null;
}

interface CachedUsageLimits {
	data: UsageLimits;
	timestamp: number;
}

interface Credentials {
	claudeAiOauth: {
		accessToken: string;
		refreshToken: string;
		expiresAt: number;
		scopes: string[];
		subscriptionType: string;
	};
}

const CACHE_DURATION_MS = 60 * 1000; // 1 minute

function getCacheFilePath(): string {
	const projectRoot = join(__dirname, "..", "..");
	return join(projectRoot, "data", "usage-limits-cache.json");
}

export async function getCredentials(): Promise<string | null> {
	try {
		const os = platform();

		if (os === "darwin") {
			// macOS: use security command
			const { stdout } = await execAsync(
				'security find-generic-password -s "Claude Code-credentials" -w'
			);
			const creds: Credentials = JSON.parse(stdout.trim());
			return creds.claudeAiOauth.accessToken;
		} else {
			// Linux: try to read from Claude's config directory
			const credentialsPath = join(homedir(), ".claude", ".credentials.json");
			if (existsSync(credentialsPath)) {
				const content = await readFile(credentialsPath, "utf-8");
				const creds: Credentials = JSON.parse(content);
				return creds.claudeAiOauth.accessToken;
			}

			// Alternative: check for secret-tool (Linux keyring)
			try {
				const { stdout } = await execAsync(
					'secret-tool lookup service "Claude Code-credentials"'
				);
				const creds: Credentials = JSON.parse(stdout.trim());
				return creds.claudeAiOauth.accessToken;
			} catch {
				return null;
			}
		}
	} catch {
		return null;
	}
}

export async function fetchUsageLimits(
	token: string,
): Promise<UsageLimits | null> {
	try {
		const response = await fetch("https://api.anthropic.com/api/oauth/usage", {
			method: "GET",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
				"User-Agent": "claude-code/2.0.31",
				Authorization: `Bearer ${token}`,
				"anthropic-beta": "oauth-2025-04-20",
				"Accept-Encoding": "gzip, compress, deflate, br",
			},
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();

		return {
			five_hour: data.five_hour || null,
			seven_day: data.seven_day || null,
		};
	} catch {
		return null;
	}
}

async function loadCache(): Promise<CachedUsageLimits | null> {
	try {
		const cacheFile = getCacheFilePath();
		if (!existsSync(cacheFile)) {
			return null;
		}

		const content = await readFile(cacheFile, "utf-8");
		const cached: CachedUsageLimits = JSON.parse(content);

		const now = Date.now();
		if (now - cached.timestamp < CACHE_DURATION_MS) {
			return cached;
		}

		return null;
	} catch {
		return null;
	}
}

async function saveCache(data: UsageLimits): Promise<void> {
	try {
		const cacheFile = getCacheFilePath();
		const cached: CachedUsageLimits = {
			data,
			timestamp: Date.now(),
		};

		await writeFile(cacheFile, JSON.stringify(cached, null, 2));
	} catch {
		// Fail silently
	}
}

export async function getUsageLimits(): Promise<UsageLimits> {
	try {
		const cached = await loadCache();
		if (cached) {
			return cached.data;
		}

		const token = await getCredentials();

		if (!token) {
			return { five_hour: null, seven_day: null };
		}

		const limits = await fetchUsageLimits(token);

		if (!limits) {
			return { five_hour: null, seven_day: null };
		}

		await saveCache(limits);

		return limits;
	} catch {
		return { five_hour: null, seven_day: null };
	}
}
