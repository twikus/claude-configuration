#!/usr/bin/env bun

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface Session {
  id: string;
  cost: number;
  date: string;
  duration_ms?: number;
  lines_added?: number;
  lines_removed?: number;
  cwd?: string;
}

interface SpendData {
  sessions: Session[];
}

interface OldFormat {
  costs: Record<string, { cost: string; date: string }>;
}

const SPEND_FILE = join(homedir(), '.claude', 'spend.json');

function loadSpendData(): SpendData {
  if (!existsSync(SPEND_FILE)) {
    return { sessions: [] };
  }

  const content = readFileSync(SPEND_FILE, 'utf-8');
  const parsed = JSON.parse(content);

  if ('costs' in parsed) {
    const sessions: Session[] = Object.entries((parsed as OldFormat).costs).map(([id, data]) => ({
      id,
      cost: parseFloat(data.cost.replace('$', '')),
      date: `${data.date.slice(0, 4)}-${data.date.slice(4, 6)}-${data.date.slice(6, 8)}`,
    }));

    const newData: SpendData = { sessions };
    writeFileSync(SPEND_FILE, JSON.stringify(newData, null, 2));
    console.log('✅ Migrated old format to new format');
    return newData;
  }

  if (!parsed.sessions) {
    return { sessions: [] };
  }

  return parsed as SpendData;
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(2)}`;
}

function formatDuration(ms?: number): string {
  if (!ms) return '';
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
}

function shortenPath(path?: string): string {
  if (!path) return '';
  const home = homedir();
  if (path.startsWith(home)) {
    return '~' + path.slice(home.length);
  }
  return path;
}

function showToday() {
  const data = loadSpendData();
  const today = new Date().toISOString().split('T')[0];

  const todaySessions = data.sessions.filter(s => s.date === today);
  const totalCost = todaySessions.reduce((sum, s) => sum + s.cost, 0);
  const totalDuration = todaySessions.reduce((sum, s) => sum + (s.duration_ms || 0), 0);
  const totalAdded = todaySessions.reduce((sum, s) => sum + (s.lines_added || 0), 0);
  const totalRemoved = todaySessions.reduce((sum, s) => sum + (s.lines_removed || 0), 0);

  console.log(`\n📅 Today (${today})`);
  console.log(`─────────────────────────────────────────`);
  console.log(`Sessions: ${todaySessions.length}`);
  console.log(`Total Cost: ${formatCost(totalCost)}`);
  console.log(`Total Duration: ${formatDuration(totalDuration)}`);
  console.log(`Lines: +${totalAdded} -${totalRemoved}`);

  if (todaySessions.length > 0) {
    console.log(`\nSessions:`);
    todaySessions.forEach(s => {
      const duration = formatDuration(s.duration_ms);
      const lines = (s.lines_added || s.lines_removed)
        ? ` | +${s.lines_added || 0} -${s.lines_removed || 0}`
        : '';
      const path = s.cwd ? ` | ${shortenPath(s.cwd)}` : '';
      console.log(`  • ${s.id.slice(0, 8)}... ${formatCost(s.cost)} | ${duration}${lines}${path}`);
    });
  }
  console.log();
}

function showMonth() {
  const data = loadSpendData();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;

  const monthSessions = data.sessions.filter(s => s.date.startsWith(monthStr));

  const dailyStats = monthSessions.reduce((acc, s) => {
    if (!acc[s.date]) {
      acc[s.date] = { cost: 0, duration: 0, added: 0, removed: 0, count: 0 };
    }
    acc[s.date].cost += s.cost;
    acc[s.date].duration += s.duration_ms || 0;
    acc[s.date].added += s.lines_added || 0;
    acc[s.date].removed += s.lines_removed || 0;
    acc[s.date].count += 1;
    return acc;
  }, {} as Record<string, { cost: number; duration: number; added: number; removed: number; count: number }>);

  const dates = Object.keys(dailyStats).sort();
  const totalCost = Object.values(dailyStats).reduce((sum, d) => sum + d.cost, 0);
  const totalDuration = Object.values(dailyStats).reduce((sum, d) => sum + d.duration, 0);
  const totalAdded = Object.values(dailyStats).reduce((sum, d) => sum + d.added, 0);
  const totalRemoved = Object.values(dailyStats).reduce((sum, d) => sum + d.removed, 0);

  console.log(`\n📊 Month (${monthStr})`);
  console.log(`─────────────────────────────────────────────────────────────────────`);
  console.log(`Date       │ Sessions │   Cost   │ Duration │  Lines`);
  console.log(`───────────┼──────────┼──────────┼──────────┼─────────────────`);

  dates.forEach(date => {
    const stats = dailyStats[date];
    const duration = formatDuration(stats.duration).padEnd(8);
    const lines = `+${stats.added} -${stats.removed}`;
    console.log(
      `${date} │    ${String(stats.count).padStart(2)}    │ ${formatCost(stats.cost).padStart(8)} │ ${duration} │ ${lines}`
    );
  });

  console.log(`───────────┴──────────┴──────────┴──────────┴─────────────────`);
  const totalDur = formatDuration(totalDuration).padEnd(8);
  console.log(
    `Total      │    ${String(monthSessions.length).padStart(2)}    │ ${formatCost(totalCost).padStart(8)} │ ${totalDur} │ +${totalAdded} -${totalRemoved}`
  );
  console.log();
}

const command = process.argv[2];

switch (command) {
  case 'today':
    showToday();
    break;
  case 'month':
    showMonth();
    break;
  default:
    console.log('Usage: spend [today|month]');
    process.exit(1);
}
