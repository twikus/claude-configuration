import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { HookInput } from "./types";
import { updatePeriodCost } from "./usage-limits";

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

export interface SpendSession {
	id: string;
	cost: number;
	date: string;
	duration_ms: number;
	lines_added: number;
	lines_removed: number;
	cwd: string;
	last_resets_at?: string;
}

export interface SpendData {
	sessions: SpendSession[];
}

export function getSpendFilePath(): string {
	// Use the project's data folder instead of ~/.claude
	const projectRoot = join(import.meta.dir, "..", "..");
	return join(projectRoot, "data", "spend.json");
}

export async function loadSpendData(): Promise<SpendData> {
	const spendFile = getSpendFilePath();

	if (!existsSync(spendFile)) {
		return { sessions: [] };
	}

	const content = await readFile(spendFile, "utf-8");
	return JSON.parse(content);
}

export async function saveSpendData(data: SpendData): Promise<void> {
	const spendFile = getSpendFilePath();
	const projectRoot = join(import.meta.dir, "..", "..");
	const dataDir = join(projectRoot, "data");

	if (!existsSync(dataDir)) {
		mkdirSync(dataDir, { recursive: true });
	}

	// Protection: never save fewer sessions than already exist
	if (existsSync(spendFile)) {
		const existingContent = await readFile(spendFile, "utf-8");
		const existingData: SpendData = JSON.parse(existingContent);
		if (data.sessions.length < existingData.sessions.length) {
			throw new Error(
				`Refusing to save: would lose ${existingData.sessions.length - data.sessions.length} sessions`,
			);
		}
	}

	await writeFile(spendFile, JSON.stringify(data, null, "\t"));
}

export async function saveSession(
	input: HookInput,
	currentResetsAt?: string,
): Promise<void> {
	if (
		!input.session_id ||
		input.cost.total_cost_usd === 0 ||
		input.cost.total_cost_usd === null
	) {
		return;
	}

	const data = await loadSpendData();
	const isoDate = new Date().toISOString().split("T")[0];

	const existingSession = data.sessions.find((s) => s.id === input.session_id);
	const oldCost = existingSession?.cost ?? 0;
	const oldResetsAt = existingSession?.last_resets_at;
	const newCost = input.cost.total_cost_usd;
	const costDelta = newCost - oldCost;

	// Normalize resets_at values for comparison (rounded to 5-minute intervals)
	const normalizedCurrentResetsAt = currentResetsAt
		? normalizeResetsAt(currentResetsAt)
		: undefined;
	const normalizedOldResetsAt = oldResetsAt
		? normalizeResetsAt(oldResetsAt)
		: undefined;

	// Check if we crossed a period boundary
	const periodChanged =
		normalizedCurrentResetsAt &&
		normalizedOldResetsAt &&
		normalizedCurrentResetsAt !== normalizedOldResetsAt;

	// When period changes, don't add any cost delta to the new period because:
	// 1. The cost accumulated before the period change belongs to the old period
	// 2. We can't know exactly what portion was before/after the boundary
	// 3. After this update, the session will have the new resets_at, so future
	//    deltas will correctly be attributed to the new period
	const costToAdd = periodChanged ? 0 : costDelta;

	const session: SpendSession = {
		id: input.session_id,
		cost: newCost,
		date: isoDate,
		duration_ms: input.cost.total_duration_ms,
		lines_added: input.cost.total_lines_added,
		lines_removed: input.cost.total_lines_removed,
		cwd: input.cwd,
		last_resets_at: normalizedCurrentResetsAt ?? normalizedOldResetsAt,
	};

	const existingIndex = data.sessions.findIndex(
		(s) => s.id === input.session_id,
	);

	if (existingIndex !== -1) {
		data.sessions[existingIndex] = session;
	} else {
		data.sessions.push(session);
	}

	await saveSpendData(data);

	if (costToAdd > 0) {
		await updatePeriodCost(costToAdd);
	}
}

export function filterSessionsByDate(
	sessions: SpendSession[],
	startDate: Date,
	endDate?: Date,
): SpendSession[] {
	return sessions.filter((session) => {
		const sessionDate = new Date(session.date);
		if (endDate) {
			return sessionDate >= startDate && sessionDate <= endDate;
		}
		return sessionDate >= startDate;
	});
}

export function calculateTotalCost(sessions: SpendSession[]): number {
	return sessions.reduce((sum, session) => sum + session.cost, 0);
}

export function calculateTotalDuration(sessions: SpendSession[]): number {
	return sessions.reduce((sum, session) => sum + session.duration_ms, 0);
}

export function getTodayStart(): Date {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}

export function getMonthStart(): Date {
	const today = new Date();
	return new Date(today.getFullYear(), today.getMonth(), 1);
}

export async function getTodayCost(): Promise<number> {
	try {
		const data = await loadSpendData();
		const today = getTodayStart();
		const todaySessions = filterSessionsByDate(data.sessions, today);
		return calculateTotalCost(todaySessions);
	} catch {
		return 0;
	}
}
