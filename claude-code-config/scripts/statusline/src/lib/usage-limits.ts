import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";

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

export interface DailyUsageEntry {
	date: string;
	utilization: number;
	resets_at: string;
	timestamp: number;
	period_cost: number;
}

interface CachedUsageLimits {
	data: UsageLimits;
	timestamp: number;
}

const CACHE_DURATION_MS = 60 * 1000; // 1 minute

function getCacheFilePath(): string {
	const projectRoot = join(import.meta.dir, "..", "..");
	return join(projectRoot, "data", "usage-limits-cache.json");
}

function getDailyUsageFilePath(): string {
	const projectRoot = join(import.meta.dir, "..", "..");
	return join(projectRoot, "data", "daily-usage.json");
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

export async function getCredentials(): Promise<string | null> {
	try {
		const result =
			await $`security find-generic-password -s "Claude Code-credentials" -w`
				.quiet()
				.text();
		const creds: Credentials = JSON.parse(result.trim());
		return creds.claudeAiOauth.accessToken;
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

		// Check if cache is still valid (< 1 minute old)
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

async function loadDailyUsage(): Promise<DailyUsageEntry[]> {
	try {
		const dailyUsageFile = getDailyUsageFilePath();
		if (!existsSync(dailyUsageFile)) {
			return [];
		}

		const content = await readFile(dailyUsageFile, "utf-8");
		return JSON.parse(content);
	} catch {
		return [];
	}
}

async function saveDailyUsage(entries: DailyUsageEntry[]): Promise<void> {
	try {
		const dailyUsageFile = getDailyUsageFilePath();
		await writeFile(dailyUsageFile, JSON.stringify(entries, null, 2));
	} catch {
		// Fail silently
	}
}

function normalizeResetsAt(resetsAt: string): string {
	try {
		const date = new Date(resetsAt);
		const minutes = date.getMinutes();
		const roundedMinutes = Math.round(minutes / 5) * 5;

		date.setMinutes(roundedMinutes);
		date.setSeconds(0);
		date.setMilliseconds(0);

		return date.toISOString();
	} catch {
		return resetsAt;
	}
}

async function recordDailyUsage(
	utilization: number,
	resetsAt: string,
): Promise<void> {
	try {
		const today = new Date().toISOString().split("T")[0];
		const entries = await loadDailyUsage();

		const normalizedResetsAt = normalizeResetsAt(resetsAt);

		const existingIndex = entries.findIndex(
			(e) => e.resets_at === normalizedResetsAt,
		);

		if (existingIndex !== -1) {
			entries[existingIndex] = {
				...entries[existingIndex],
				date: today,
				utilization,
				timestamp: Date.now(),
			};
		} else {
			entries.push({
				date: today,
				utilization,
				resets_at: normalizedResetsAt,
				timestamp: Date.now(),
				period_cost: 0,
			});
		}

		entries.sort((a, b) => {
			const dateCompare = b.date.localeCompare(a.date);
			if (dateCompare !== 0) return dateCompare;
			return b.timestamp - a.timestamp;
		});

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - 90);
		const cutoffStr = cutoffDate.toISOString().split("T")[0];

		const filtered = entries.filter((e) => e.date >= cutoffStr);

		await saveDailyUsage(filtered);
	} catch {
		// Fail silently
	}
}

export async function updatePeriodCost(costDelta: number): Promise<void> {
	try {
		const entries = await loadDailyUsage();

		if (entries.length === 0) {
			return;
		}

		entries[0].period_cost += costDelta;

		await saveDailyUsage(entries);
	} catch {
		// Fail silently
	}
}

export async function getCurrentPeriodCost(): Promise<number> {
	try {
		const entries = await loadDailyUsage();

		if (entries.length === 0) {
			return 0;
		}

		return entries[0].period_cost;
	} catch {
		return 0;
	}
}

async function loadFallbackFromDailyUsage(): Promise<UsageLimits> {
	try {
		const entries = await loadDailyUsage();
		if (entries.length === 0) {
			return { five_hour: null, seven_day: null };
		}

		const mostRecent = entries[0];
		return {
			five_hour: {
				utilization: mostRecent.utilization,
				resets_at: mostRecent.resets_at,
			},
			seven_day: null,
		};
	} catch {
		return { five_hour: null, seven_day: null };
	}
}

export async function getUsageLimits(): Promise<UsageLimits> {
	try {
		const cached = await loadCache();
		if (cached) {
			if (cached.data.five_hour?.resets_at) {
				await recordDailyUsage(
					cached.data.five_hour.utilization,
					cached.data.five_hour.resets_at,
				);
			}
			return cached.data;
		}

		const token = await getCredentials();

		if (!token) {
			return await loadFallbackFromDailyUsage();
		}

		const limits = await fetchUsageLimits(token);

		if (!limits) {
			return await loadFallbackFromDailyUsage();
		}

		await saveCache(limits);

		if (limits.five_hour?.resets_at) {
			await recordDailyUsage(
				limits.five_hour.utilization,
				limits.five_hour.resets_at,
			);
		}

		return limits;
	} catch {
		return await loadFallbackFromDailyUsage();
	}
}

export interface DailyUsageStats {
	average: number;
	totalDays: number;
	totalSessions: number;
	totalCost: number;
	dailyAverages: Array<{
		date: string;
		average: number;
		max: number;
		min: number;
		sessionCount: number;
		totalCost: number;
	}>;
}

export async function getDailyUsageStats(): Promise<DailyUsageStats> {
	const entries = await loadDailyUsage();

	if (entries.length === 0) {
		return {
			average: 0,
			totalDays: 0,
			totalSessions: 0,
			totalCost: 0,
			dailyAverages: [],
		};
	}

	const byDate = new Map<
		string,
		{
			values: number[];
			sum: number;
			max: number;
			min: number;
			totalCost: number;
		}
	>();

	for (const entry of entries) {
		const existing = byDate.get(entry.date);

		if (existing) {
			existing.values.push(entry.utilization);
			existing.sum += entry.utilization;
			existing.max = Math.max(existing.max, entry.utilization);
			existing.min = Math.min(existing.min, entry.utilization);
			existing.totalCost += entry.period_cost;
		} else {
			byDate.set(entry.date, {
				values: [entry.utilization],
				sum: entry.utilization,
				max: entry.utilization,
				min: entry.utilization,
				totalCost: entry.period_cost,
			});
		}
	}

	const dailyAverages = Array.from(byDate.entries())
		.map(([date, data]) => ({
			date,
			average: data.sum / data.values.length,
			max: data.max,
			min: data.min,
			sessionCount: data.values.length,
			totalCost: data.totalCost,
		}))
		.sort((a, b) => b.date.localeCompare(a.date));

	const overallAverage =
		dailyAverages.reduce((sum, day) => sum + day.average, 0) /
		dailyAverages.length;

	const totalCost = dailyAverages.reduce((sum, day) => sum + day.totalCost, 0);

	return {
		average: overallAverage,
		totalDays: dailyAverages.length,
		totalSessions: entries.length,
		totalCost,
		dailyAverages,
	};
}
