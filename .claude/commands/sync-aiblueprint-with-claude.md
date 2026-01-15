---
allowed-tools: Bash(cp :*), Bash(diff :*), Bash(ls :*), Bash(cat :*), Bash(mkdir :*), Bash(find :*), Bash(date :*), Read, Write, Edit
description: Sync NEW files from this repository to ~/.claude
---

You are a sync automation specialist. Your job is to find and copy ONLY NEW files from claude-code-config TO ~/.claude.

## Configuration

- **Source**: `$CWD/claude-code-config`
- **Target**: `~/.claude`
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

For each directory, find files that exist in claude-code-config but NOT in ~/.claude:

```bash
# Find new commands (files only in claude-code-config)
diff -rq $CWD/claude-code-config/commands/ ~/.claude/commands/ 2>/dev/null | grep "Only in.*claude-code-config"
```

This will output lines like:
- `Only in /path/claude-code-config/commands: new-cmd.md` → NEW file
- `Only in /path/claude-code-config/commands/utils: helper.md` → NEW file in subdir

**IGNORE** lines that say:
- `Only in /Users/melvynx/.claude/...` (files only in target - don't delete)
- `Files ... differ` (modified files - don't overwrite)

### Step 2: Copy Each NEW File Individually

For each new file found, copy it with its exact path:

```bash
# Example: New file in root
cp $CWD/claude-code-config/commands/new-cmd.md ~/.claude/commands/new-cmd.md

# Example: New file in subdirectory (create dir first if needed)
mkdir -p ~/.claude/commands/utils/
cp $CWD/claude-code-config/commands/utils/helper.md ~/.claude/commands/utils/helper.md

# Example: New skill folder
mkdir -p ~/.claude/skills/new-skill/
cp $CWD/claude-code-config/skills/new-skill/SKILL.md ~/.claude/skills/new-skill/SKILL.md
```

### Step 3: Scripts - Copy Source Files Only

For scripts/statusline and scripts/command-validator:
- **COPY**: `.ts`, `.js`, `.json` (package.json, tsconfig.json), `.md` files
- **SKIP**: `node_modules/`, `data/`, `*.db`, `*.log`, cache files

### Step 4: Update CHANGELOG.md

Prepend new entry with ONLY the new files copied:

```markdown
# Claude Code Config Sync Changelog

## [YYYY-MM-DD HH:MM:SS] - Synced TO ~/.claude

### New Commands
- `commands/new-cmd.md` → ~/.claude/commands/

### New Skills
- `skills/new-skill/` → ~/.claude/skills/

### New Agents
- `agents/new-agent.md` → ~/.claude/agents/

### Scripts Updated
- `scripts/statusline/src/new-file.ts` → ~/.claude/scripts/

---
```

## What NOT to Do

- ❌ Do NOT use rsync
- ❌ Do NOT copy entire directories
- ❌ Do NOT overwrite existing files (even if different)
- ❌ Do NOT copy node_modules, data/, .db, .log files
- ❌ Do NOT delete files that only exist in target (~/.claude)

## Output Summary

```
✅ Sync to ~/.claude Complete - [timestamp]

New files copied to ~/.claude:
- commands/new-cmd.md
- skills/new-skill/SKILL.md

📝 CHANGELOG.md updated
```

---

User: Sync now #$ARGUMENTS
