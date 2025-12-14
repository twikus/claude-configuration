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
 * Key insight: We only add the DELTA to the period cost, not the full session cost.
 *
 * Example:
 * - Session X has total cost $24
 * - We already tracked $10 for this session in this period
 * - Delta = $24 - $10 = $14
 * - We add $14 to the period cost (not $24!)
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
	const oldTotalCost = existingSession?.total_cost ?? 0;

	upsertSession({
		session_id: sessionId,
		total_cost: newTotalCost,
		cwd: input.cwd,
		date: today,
		duration_ms: input.cost.total_duration_ms,
		lines_added: input.cost.total_lines_added,
		lines_removed: input.cost.total_lines_removed,
		last_resets_at: normalizedPeriodId,
	});

	if (!normalizedPeriodId) {
		return;
	}

	const tracking = getTracking(sessionId, normalizedPeriodId);

	let periodDelta: number;

	if (tracking) {
		const lastTrackedSessionCost = tracking.last_session_cost;
		periodDelta = newTotalCost - lastTrackedSessionCost;

		if (periodDelta > 0) {
			upsertTracking({
				session_id: sessionId,
				period_id: normalizedPeriodId,
				counted_cost: tracking.counted_cost + periodDelta,
				last_session_cost: newTotalCost,
			});
		}
	} else {
		// First time tracking this session in this period
		// CRITICAL: We only track the DELTA from this point forward.
		// If the session already has cost from previous periods, we DON'T count it.
		// We set last_session_cost = newTotalCost so future updates only count the delta.
		periodDelta = newTotalCost - oldTotalCost;

		// Only add to period if this is a true new cost delta (not just first time seeing an old session)
		const shouldCountDelta =
			!existingSession || existingSession.last_resets_at === normalizedPeriodId;

		if (periodDelta > 0 && shouldCountDelta) {
			upsertTracking({
				session_id: sessionId,
				period_id: normalizedPeriodId,
				counted_cost: periodDelta,
				last_session_cost: newTotalCost,
			});
		} else {
			// Session from a previous period - just start tracking from current cost
			// Don't add anything to period cost (the cost was from before this period)
			upsertTracking({
				session_id: sessionId,
				period_id: normalizedPeriodId,
				counted_cost: 0,
				last_session_cost: newTotalCost,
			});
			periodDelta = 0; // Don't add to period total
		}
	}

	if (periodDelta > 0) {
		addToPeriodCost(normalizedPeriodId, periodDelta);
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
	}));
}

export function calculateTotalCost(sessions: SpendSessionV2[]): number {
	return sessions.reduce((sum, session) => sum + session.total_cost, 0);
}
