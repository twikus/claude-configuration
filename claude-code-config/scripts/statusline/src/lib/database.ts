import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getDbPath(): string {
	const projectRoot = join(__dirname, "..", "..");
	const dataDir = join(projectRoot, "data");

	if (!existsSync(dataDir)) {
		mkdirSync(dataDir, { recursive: true });
	}

	return join(dataDir, "statusline.db");
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
	if (!db) {
		db = new Database(getDbPath());
		initializeSchema();
	}
	return db;
}

function initializeSchema(): void {
	const database = db!;

	database.exec(`
		CREATE TABLE IF NOT EXISTS sessions (
			session_id TEXT PRIMARY KEY,
			total_cost REAL NOT NULL DEFAULT 0,
			cwd TEXT NOT NULL,
			date TEXT NOT NULL,
			duration_ms INTEGER NOT NULL DEFAULT 0,
			lines_added INTEGER NOT NULL DEFAULT 0,
			lines_removed INTEGER NOT NULL DEFAULT 0,
			last_resets_at TEXT,
			created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
			updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
		)
	`);

	database.exec(`
		CREATE TABLE IF NOT EXISTS session_period_tracking (
			session_id TEXT NOT NULL,
			period_id TEXT NOT NULL,
			counted_cost REAL NOT NULL DEFAULT 0,
			last_session_cost REAL NOT NULL DEFAULT 0,
			updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
			PRIMARY KEY (session_id, period_id)
		)
	`);

	database.exec(`
		CREATE TABLE IF NOT EXISTS periods (
			period_id TEXT PRIMARY KEY,
			total_cost REAL NOT NULL DEFAULT 0,
			utilization INTEGER NOT NULL DEFAULT 0,
			date TEXT NOT NULL,
			created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
			updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
		)
	`);

	database.exec(`
		CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date)
	`);

	database.exec(`
		CREATE INDEX IF NOT EXISTS idx_tracking_period ON session_period_tracking(period_id)
	`);

	database.exec(`
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
	const stmt = database.prepare("SELECT * FROM sessions WHERE session_id = ?");
	return stmt.get(sessionId) as SessionRow | null;
}

export function upsertSession(session: SessionRow): void {
	const database = getDb();
	const stmt = database.prepare(`
		INSERT INTO sessions (session_id, total_cost, cwd, date, duration_ms, lines_added, lines_removed, last_resets_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))
		ON CONFLICT(session_id) DO UPDATE SET
			total_cost = excluded.total_cost,
			cwd = excluded.cwd,
			date = excluded.date,
			duration_ms = excluded.duration_ms,
			lines_added = excluded.lines_added,
			lines_removed = excluded.lines_removed,
			last_resets_at = excluded.last_resets_at,
			updated_at = strftime('%s', 'now')
	`);
	stmt.run(
		session.session_id,
		session.total_cost,
		session.cwd,
		session.date,
		session.duration_ms,
		session.lines_added,
		session.lines_removed,
		session.last_resets_at,
	);
}

export function getTracking(
	sessionId: string,
	periodId: string,
): TrackingRow | null {
	const database = getDb();
	const stmt = database.prepare(
		"SELECT * FROM session_period_tracking WHERE session_id = ? AND period_id = ?",
	);
	return stmt.get(sessionId, periodId) as TrackingRow | null;
}

export function upsertTracking(tracking: TrackingRow): void {
	const database = getDb();
	const stmt = database.prepare(`
		INSERT INTO session_period_tracking (session_id, period_id, counted_cost, last_session_cost, updated_at)
		VALUES (?, ?, ?, ?, strftime('%s', 'now'))
		ON CONFLICT(session_id, period_id) DO UPDATE SET
			counted_cost = excluded.counted_cost,
			last_session_cost = excluded.last_session_cost,
			updated_at = strftime('%s', 'now')
	`);
	stmt.run(
		tracking.session_id,
		tracking.period_id,
		tracking.counted_cost,
		tracking.last_session_cost,
	);
}

export function getPeriod(periodId: string): PeriodRow | null {
	const database = getDb();
	const stmt = database.prepare("SELECT * FROM periods WHERE period_id = ?");
	return stmt.get(periodId) as PeriodRow | null;
}

export function upsertPeriod(period: PeriodRow): void {
	const database = getDb();
	const stmt = database.prepare(`
		INSERT INTO periods (period_id, total_cost, utilization, date, updated_at)
		VALUES (?, ?, ?, ?, strftime('%s', 'now'))
		ON CONFLICT(period_id) DO UPDATE SET
			total_cost = excluded.total_cost,
			utilization = excluded.utilization,
			date = excluded.date,
			updated_at = strftime('%s', 'now')
	`);
	stmt.run(period.period_id, period.total_cost, period.utilization, period.date);
}

export function addToPeriodCost(periodId: string, delta: number): void {
	const database = getDb();
	const today = new Date().toISOString().split("T")[0];

	const stmt = database.prepare(`
		INSERT INTO periods (period_id, total_cost, utilization, date, updated_at)
		VALUES (?, ?, 0, ?, strftime('%s', 'now'))
		ON CONFLICT(period_id) DO UPDATE SET
			total_cost = total_cost + ?,
			updated_at = strftime('%s', 'now')
	`);
	stmt.run(periodId, delta, today, delta);
}

export function getPeriodCost(periodId: string): number {
	const period = getPeriod(periodId);
	return period?.total_cost ?? 0;
}

export function getSessionsByDate(date: string): SessionRow[] {
	const database = getDb();
	const stmt = database.prepare("SELECT * FROM sessions WHERE date = ?");
	return stmt.all(date) as SessionRow[];
}

export function getTodaySessionsTotal(): number {
	const database = getDb();
	const today = new Date().toISOString().split("T")[0];
	const stmt = database.prepare(
		"SELECT COALESCE(SUM(total_cost), 0) as total FROM sessions WHERE date = ?",
	);
	const result = stmt.get(today) as { total: number } | undefined;
	return result?.total ?? 0;
}

export function getAllSessions(): SessionRow[] {
	const database = getDb();
	const stmt = database.prepare("SELECT * FROM sessions ORDER BY date DESC");
	return stmt.all() as SessionRow[];
}

export function closeDb(): void {
	if (db) {
		db.close();
		db = null;
	}
}
