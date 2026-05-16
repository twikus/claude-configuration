import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getClaudeCodeTokenSafe } from "../../../../../claude-code-ai/helper/credentials";
import type { CachedUsageLimits, UsageLimits } from "./types";

const CACHE_DURATION_MS = 60 * 1000; // 1 minute

function getCacheFilePath(): string {
	const projectRoot = join(import.meta.dir, "..", "..", "..", "..");
	return join(projectRoot, "data", "usage-limits-cache.json");
}

export async function getCredentials(): Promise<string | null> {
	return getClaudeCodeTokenSafe();
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

export type { CachedUsageLimits, UsageLimits } from "./types";
