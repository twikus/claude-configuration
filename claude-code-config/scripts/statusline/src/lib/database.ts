import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

function getDbPath(): string {
	const projectRoot = join(import.meta.dir, "..", "..");
	const dataDir = join(projectRoot, "data");

	if (!existsSync(dataDir)) {
		mkdirSync(dataDir, { recursive: true });
	}

	return join(dataDir, "statusline.db");
}

let db: Database | null = null;

function runCumulativeCountedMigration(database: Database): void {
	const sessions = database
		.query<{ session_id: string }, []>("SELECT session_id FROM sessions")
		.all();

	for (const session of sessions) {
		const result = database
			.query<{ total: number }, [string]>(
				"SELECT COALESCE(SUM(counted_cost), 0) as total FROM session_period_tracking WHERE session_id = ?",
			)
			.get(session.session_id);
		const totalCounted = result?.total ?? 0;

		database.run(
			"UPDATE sessions SET cumulative_counted = ? WHERE session_id = ?",
			[totalCounted, session.session_id],
		);
	}
}

export function getDb(): Database {
	if (!db) {
		db = new Database(getDbPath());
		initializeSchema(db);
	}
	return db;
}

function initializeSchema(database: Database): void {
	database.run(`
		CREATE TABLE IF NOT EXISTS sessions (
			session_id TEXT PRIMARY KEY,
			total_cost REAL NOT NULL DEFAULT 0,
			cwd TEXT NOT NULL,
			date TEXT NOT NULL,
			duration_ms INTEGER NOT NULL DEFAULT 0,
			lines_added INTEGER NOT NULL DEFAULT 0,
			lines_removed INTEGER NOT NULL DEFAULT 0,
			last_resets_at TEXT,
			cumulative_counted REAL NOT NULL DEFAULT 0,
			created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
			updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
		)
	`);

	// Migration: add cumulative_counted column if it doesn't exist
	try {
		database.run(
			`ALTER TABLE sessions ADD COLUMN cumulative_counted REAL NOT NULL DEFAULT 0`,
		);
		// Column was just added, run migration to populate it
		runCumulativeCountedMigration(database);
	} catch {
		// Column already exists
	}

	database.run(`
		CREATE TABLE IF NOT EXISTS session_period_tracking (
			session_id TEXT NOT NULL,
			period_id TEXT NOT NULL,
			counted_cost REAL NOT NULL DEFAULT 0,
			last_session_cost REAL NOT NULL DEFAULT 0,
			updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
			PRIMARY KEY (session_id, period_id)
		)
	`);

	database.run(`
		CREATE TABLE IF NOT EXISTS periods (
			period_id TEXT PRIMARY KEY,
			total_cost REAL NOT NULL DEFAULT 0,
			utilization INTEGER NOT NULL DEFAULT 0,
			date TEXT NOT NULL,
			created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
			updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
		)
	`);

	database.run(`
		CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date)
	`);

	database.run(`
		CREATE INDEX IF NOT EXISTS idx_tracking_period ON session_period_tracking(period_id)
	`);

	database.run(`
		CREATE INDEX IF NOT EXISTS idx_periods_date ON periods(date)
	`);
}

export interface SessionRow {
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

export interface PeriodRow {
	period_id: string;
	total_cost: number;
	utilization: number;
	date: string;
}

export interface TrackingRow {
	session_id: string;
	period_id: string;
	counted_cost: number;
	last_session_cost: number;
}

export function getSession(sessionId: string): SessionRow | null {
	const database = getDb();
	return database
		.query<SessionRow, [string]>("SELECT * FROM sessions WHERE session_id = ?")
		.get(sessionId);
}

export function upsertSession(session: SessionRow): void {
	const database = getDb();
	database.run(
		`
		INSERT INTO sessions (session_id, total_cost, cwd, date, duration_ms, lines_added, lines_removed, last_resets_at, cumulative_counted, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))
		ON CONFLICT(session_id) DO UPDATE SET
			total_cost = excluded.total_cost,
			cwd = excluded.cwd,
			date = excluded.date,
			duration_ms = excluded.duration_ms,
			lines_added = excluded.lines_added,
			lines_removed = excluded.lines_removed,
			last_resets_at = excluded.last_resets_at,
			cumulative_counted = excluded.cumulative_counted,
			updated_at = strftime('%s', 'now')
	`,
		[
			session.session_id,
			session.total_cost,
			session.cwd,
			session.date,
			session.duration_ms,
			session.lines_added,
			session.lines_removed,
			session.last_resets_at,
			session.cumulative_counted,
		],
	);
}

export function getTracking(
	sessionId: string,
	periodId: string,
): TrackingRow | null {
	const database = getDb();
	return database
		.query<TrackingRow, [string, string]>(
			"SELECT * FROM session_period_tracking WHERE session_id = ? AND period_id = ?",
		)
		.get(sessionId, periodId);
}

export function upsertTracking(tracking: TrackingRow): void {
	const database = getDb();
	database.run(
		`
		INSERT INTO session_period_tracking (session_id, period_id, counted_cost, last_session_cost, updated_at)
		VALUES (?, ?, ?, ?, strftime('%s', 'now'))
		ON CONFLICT(session_id, period_id) DO UPDATE SET
			counted_cost = excluded.counted_cost,
			last_session_cost = excluded.last_session_cost,
			updated_at = strftime('%s', 'now')
	`,
		[
			tracking.session_id,
			tracking.period_id,
			tracking.counted_cost,
			tracking.last_session_cost,
		],
	);
}

export function getPeriod(periodId: string): PeriodRow | null {
	const database = getDb();
	return database
		.query<PeriodRow, [string]>("SELECT * FROM periods WHERE period_id = ?")
		.get(periodId);
}

export function upsertPeriod(period: PeriodRow): void {
	const database = getDb();
	database.run(
		`
		INSERT INTO periods (period_id, total_cost, utilization, date, updated_at)
		VALUES (?, ?, ?, ?, strftime('%s', 'now'))
		ON CONFLICT(period_id) DO UPDATE SET
			total_cost = excluded.total_cost,
			utilization = excluded.utilization,
			date = excluded.date,
			updated_at = strftime('%s', 'now')
	`,
		[period.period_id, period.total_cost, period.utilization, period.date],
	);
}

export function addToPeriodCost(periodId: string, delta: number): void {
	const database = getDb();
	const today = new Date().toISOString().split("T")[0];

	database.run(
		`
		INSERT INTO periods (period_id, total_cost, utilization, date, updated_at)
		VALUES (?, ?, 0, ?, strftime('%s', 'now'))
		ON CONFLICT(period_id) DO UPDATE SET
			total_cost = total_cost + ?,
			updated_at = strftime('%s', 'now')
	`,
		[periodId, delta, today, delta],
	);
}

export function getPeriodCost(periodId: string): number {
	const database = getDb();
	// Calculate correct total by capping each session's counted_cost at its actual total_cost
	// This handles cases where counted_cost was overcounted due to session restarts
	const result = database
		.query<{ total: number }, [string]>(
			`
			SELECT COALESCE(SUM(MIN(spt.counted_cost, s.total_cost)), 0) as total
			FROM session_period_tracking spt
			JOIN sessions s ON s.session_id = spt.session_id
			WHERE spt.period_id = ?
			`,
		)
		.get(periodId);
	return result?.total ?? 0;
}

export function getSessionsByDate(date: string): SessionRow[] {
	const database = getDb();
	return database
		.query<SessionRow, [string]>("SELECT * FROM sessions WHERE date = ?")
		.all(date);
}

export function getTodaySessionsTotal(): number {
	const database = getDb();
	const today = new Date().toISOString().split("T")[0];
	const result = database
		.query<{ total: number }, [string]>(
			"SELECT COALESCE(SUM(total_cost), 0) as total FROM sessions WHERE date = ?",
		)
		.get(today);
	return result?.total ?? 0;
}

export function getAllSessions(): SessionRow[] {
	const database = getDb();
	return database
		.query<SessionRow, []>("SELECT * FROM sessions ORDER BY date DESC")
		.all();
}

export function getSessionTotalCounted(sessionId: string): number {
	const database = getDb();
	const result = database
		.query<{ total: number }, [string]>(
			"SELECT COALESCE(SUM(counted_cost), 0) as total FROM session_period_tracking WHERE session_id = ?",
		)
		.get(sessionId);
	return result?.total ?? 0;
}

export function migrateSessionsCumulativeCounted(): void {
	const database = getDb();
	const sessions = database
		.query<{ session_id: string }, []>("SELECT session_id FROM sessions")
		.all();

	for (const session of sessions) {
		const totalCounted = getSessionTotalCounted(session.session_id);
		database.run(
			"UPDATE sessions SET cumulative_counted = ? WHERE session_id = ?",
			[totalCounted, session.session_id],
		);
	}
}

export function closeDb(): void {
	if (db) {
		db.close();
		db = null;
	}
}
