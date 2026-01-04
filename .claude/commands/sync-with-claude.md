---
allowed-tools: Bash(cp :*), Bash(diff :*), Bash(ls :*), Bash(cat :*), Bash(mkdir :*), Bash(git :*), Bash(find :*), Bash(date :*), Read, Write, Edit
description: Sync NEW files only from ~/.claude to this repository
---

You are a sync automation specialist. Your job is to find and copy ONLY NEW files from ~/.claude to claude-code-config.

## Configuration

- **Source**: `~/.claude`
- **Target**: `$CWD/claude-code-config`
- **Changelog**: `$CWD/claude-code-config/CHANGELOG.md`

## CRITICAL RULES

1. **ONLY copy NEW files** - files that exist in source but NOT in target
2. **Copy files INDIVIDUALLY** - never use rsync or bulk copy
3. **Preserve directory structure** - create parent dirs if needed
4. **Track each file** - list every file copied in changelog

## Directories to Check

1. **commands/** - Slash commands (.md files and subdirectories)
2. **skills/** - Skills (subdirectories with SKILL.md)
3. **agents/** - Agent definitions (.md files)
4. **scripts/statusline/** - Statusline script (source code only)
5. **scripts/command-validator/** - Command validator (source code only)

## Workflow

### Step 1: Find NEW Files Only

For each directory, find files that exist in source but NOT in target:

```bash
# Find new commands (files only in source)
diff -rq ~/.claude/commands/ $CWD/claude-code-config/commands/ 2>/dev/null | grep "Only in /Users"
```

This will output lines like:
- `Only in /Users/melvynx/.claude/commands: explore.md` → NEW file
- `Only in /Users/melvynx/.claude/commands/git: new-command.md` → NEW file in subdir

**IGNORE** lines that say:
- `Only in $CWD/claude-code-config/...` (files only in target - don't delete)
- `Files ... differ` (modified files - don't overwrite)

### Step 2: Copy Each NEW File Individually

For each new file found, copy it with its exact path:

```bash
# Example: New file in root
cp ~/.claude/commands/explore.md $CWD/claude-code-config/commands/explore.md

# Example: New file in subdirectory (create dir first if needed)
mkdir -p $CWD/claude-code-config/commands/git/
cp ~/.claude/commands/git/new-command.md $CWD/claude-code-config/commands/git/new-command.md

# Example: New skill folder
mkdir -p $CWD/claude-code-config/skills/new-skill/
cp ~/.claude/skills/new-skill/SKILL.md $CWD/claude-code-config/skills/new-skill/SKILL.md
```

### Step 3: Scripts - Copy Source Files Only

For scripts/statusline and scripts/command-validator:
- **COPY**: `.ts`, `.js`, `.json` (package.json, tsconfig.json), `.md` files
- **SKIP**: `node_modules/`, `data/`, `*.db`, `*.log`, cache files

### Step 4: Update CHANGELOG.md

Prepend new entry with ONLY the new files copied:

```markdown
# Claude Code Config Sync Changelog

## [YYYY-MM-DD HH:MM:SS]

### New Commands
- `commands/explore.md`
- `commands/git/new-command.md`

### New Skills
- `skills/new-skill/`

### New Agents
- `agents/new-agent.md`

### Scripts Updated
- `scripts/statusline/src/new-file.ts`

---
```

### Step 5: Git Commit

```bash
git add $CWD/claude-code-config/
git status --short
git commit -m "chore(claude-code-config): add new files from ~/.claude

New files:
- [list each new file]"
```

## What NOT to Do

- ❌ Do NOT use rsync
- ❌ Do NOT copy entire directories
- ❌ Do NOT overwrite existing files (even if different)
- ❌ Do NOT copy node_modules, data/, .db, .log files
- ❌ Do NOT delete files that only exist in target

## Output Summary

```
✅ Sync Complete - [timestamp]

New files copied:
- commands/explore.md
- commands/docs.md
- skills/new-skill/SKILL.md

📝 CHANGELOG.md updated
🔀 Committed: [hash]
```

---

User: Sync now #$ARGUMENTS
