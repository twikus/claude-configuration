---
name: update-changelog
description: Auto-update the project changelog from git history. Analyzes commits, categorizes changes, and writes human-readable monthly changelog files.
argument-hint: "[month: YYYY-MM or 'current']"
---

# Update Changelog

Generate or update monthly changelog files in `changelog/` from git commit history.

## Arguments

- No argument or `current`: update the current month's changelog
- `YYYY-MM` (e.g. `2026-03`): update a specific month
- `all`: regenerate all months with commits

## Changelog Location

- Directory: `$CWD/changelog/`
- File format: `YYYY-MM.md` (one file per month)
- Example: `changelog/2026-03.md`

## Process

### Step 1: Determine Target Month(s)

```bash
# Get the argument
MONTH_ARG="$1"  # e.g. "2026-03", "current", "all", or empty

# If empty or "current", use current month
# If "all", get all months with commits:
git log --format="%ad" --date=format:"%Y-%m" | sort -u
```

### Step 2: Get Commits for Target Month

For each target month (YYYY-MM):

```bash
# Get commits with stats
git log --since="YYYY-MM-01" --until="YYYY-MM+1-01" \
  --pretty=format:"%h|%ad|%s" --date=short --stat
```

### Step 3: Analyze and Categorize

Group changes by date, then categorize each commit:

| Category | When to use |
|----------|------------|
| **Added** | New files, features, skills, agents, scripts |
| **Changed** | Modified existing files, updates, refactors |
| **Removed** | Deleted files, removed features |
| **Renamed** | Moved or renamed files/skills |
| **Fixed** | Bug fixes |

Tips for good changelog entries:
- Lead with the **what** (bold the name), then explain briefly
- Use git diff --stat to understand scope of changes
- Group related commits into a single entry when they're part of the same change
- Mention file counts or line changes for major modifications
- Skip noise commits (typo fixes, .DS_Store, etc.) or fold them into parent entries

### Step 4: Write Changelog

Write/update the file at `changelog/YYYY-MM.md`:

```markdown
# Changelog - Month Year

## YYYY-MM-DD

### Added
- **thing-name** - Brief description

### Changed
- **thing-name** - What changed and why

### Removed
- **thing-name** - Why removed or what replaced it
```

Rules:
- Dates in descending order (newest first)
- One `##` section per day that has commits
- Only include `###` categories that have entries
- Bold the primary subject of each entry
- Keep entries concise (1 line each)
- Don't include empty categories

### Step 5: Confirm

Show the user what was written/updated. Do NOT commit - let the user review.
