import {
	addToPeriodCost,
	getAllSessions,
	getPeriodCost,
	getSession,
	getSessionsByDate,
	getTodaySessionsTotal,
	getTracking,
	upsertSession,
	upsertTracking,
} from "./database";
import type { HookInput } from "./types";

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

/**
 * Save a session and track the delta for the current period.
 *
 * Key insight: We track cumulative_counted to prevent double-counting after session restarts.
 *
 * When Claude Code restarts, the session's cost counter resets to 0 but the session_id stays the same.
 * Without cumulative tracking, the new accumulation would be counted AGAIN.
 *
 * Solution: Only count cost that exceeds what we've EVER counted for this session.
 * actualNewCost = max(0, newTotalCost - cumulative_counted)
 */
export async function saveSessionV2(
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

	const sessionId = input.session_id;
	const newTotalCost = input.cost.total_cost_usd;
	const today = new Date().toISOString().split("T")[0];
	const normalizedPeriodId = currentResetsAt
		? normalizeResetsAt(currentResetsAt)
		: null;

	const existingSession = getSession(sessionId);
	const cumulativeCounted = existingSession?.cumulative_counted ?? 0;

	// Calculate the actual new cost that hasn't been counted yet
	// This handles session restarts: if newTotalCost < cumulativeCounted, actualNewCost = 0
	const actualNewCost = Math.max(0, newTotalCost - cumulativeCounted);

	// Update session with new cumulative counted value
	const newCumulativeCounted = cumulativeCounted + actualNewCost;

	upsertSession({
		session_id: sessionId,
		total_cost: newTotalCost,
		cwd: input.cwd,
		date: today,
		duration_ms: input.cost.total_duration_ms,
		lines_added: input.cost.total_lines_added,
		lines_removed: input.cost.total_lines_removed,
		last_resets_at: normalizedPeriodId,
		cumulative_counted: newCumulativeCounted,
	});

	if (!normalizedPeriodId) {
		return;
	}

	// Only add to period if there's actual new cost
	if (actualNewCost > 0) {
		const tracking = getTracking(sessionId, normalizedPeriodId);

		upsertTracking({
			session_id: sessionId,
			period_id: normalizedPeriodId,
			counted_cost: (tracking?.counted_cost ?? 0) + actualNewCost,
			last_session_cost: newTotalCost,
		});

		addToPeriodCost(normalizedPeriodId, actualNewCost);
	} else {
		// No new cost, but update tracking to record we've seen this session
		const tracking = getTracking(sessionId, normalizedPeriodId);
		if (!tracking) {
			upsertTracking({
				session_id: sessionId,
				period_id: normalizedPeriodId,
				counted_cost: 0,
				last_session_cost: newTotalCost,
			});
		}
	}
}

export function getCurrentPeriodCostV2(periodId: string): number {
	return getPeriodCost(periodId);
}

export function getTodayCostV2(): number {
	return getTodaySessionsTotal();
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

export interface SpendSessionV2 {
	session_id: string;
	total_cost: number;
	cwd: string;
	date: string;
	duration_ms: number;
	lines_added: number;
	lines_removed: number;
	last_resets_at: string | null;
	cumulative_counted: number;
}

export function getAllSessionsV2(): SpendSessionV2[] {
	return getAllSessions().map((row) => ({
		session_id: row.session_id,
		total_cost: row.total_cost,
		cwd: row.cwd,
		date: row.date,
		duration_ms: row.duration_ms,
		lines_added: row.lines_added,
		lines_removed: row.lines_removed,
		last_resets_at: row.last_resets_at,
		cumulative_counted: row.cumulative_counted,
	}));
}

export function getSessionsByDateV2(date: string): SpendSessionV2[] {
	return getSessionsByDate(date).map((row) => ({
		session_id: row.session_id,
		total_cost: row.total_cost,
		cwd: row.cwd,
		date: row.date,
		duration_ms: row.duration_ms,
		lines_added: row.lines_added,
		lines_removed: row.lines_removed,
		last_resets_at: row.last_resets_at,
		cumulative_counted: row.cumulative_counted,
	}));
}

export function calculateTotalCost(sessions: SpendSessionV2[]): number {
	return sessions.reduce((sum, session) => sum + session.total_cost, 0);
}
