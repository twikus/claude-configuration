---
name: sync-with-claude
description: Sync files from ~/.claude to claude-code-config repository
allowed-tools: Bash(cp :*), Bash(diff :*), Bash(ls :*), Bash(cat :*), Bash(mkdir :*), Bash(git status*), Bash(find :*), Bash(date :*), Bash(rsync :*), Bash(rm :*), Read, Write, Edit
---

# Sync ~/.claude to Repository

Sync configuration files from ~/.claude to claude-code-config folder in this repository.

## Configuration

- **Source**: `~/.claude`
- **Target**: `$CWD/claude-code-config`

## Directories to Sync

1. **commands/** - Slash commands (.md files and subdirectories)
2. **skills/** - Skills (subdirectories with SKILL.md)
3. **agents/** - Agent definitions (.md files)
4. **scripts/** - All script projects (statusline, command-validator, auto-rename-session, claude-code-ai, etc.)

## Exclusions

Always exclude:
- `node_modules/` - Dependencies (reinstall locally)
- `data/` - Runtime data
- `*.db` - Database files
- `*.log` - Log files
- `bun.lockb` - Lock files
- `.DS_Store` - macOS files
- `melvyn/` - Personal commands (NEVER sync this folder)

**Additional exclusions**: See [references/do-not-copy.md](references/do-not-copy.md) for personal/private paths that must NEVER be copied.

**Protected paths**: See [references/do-not-change.md](references/do-not-change.md) for paths in the target that must NEVER be updated or deleted.

## Process

### Step 1: Read Exclusions

Read both exclusion lists before syncing:
- [references/do-not-copy.md](references/do-not-copy.md) - paths to not copy from source
- [references/do-not-change.md](references/do-not-change.md) - paths to preserve in target

### Step 2: Dry-Run Preview

Run rsync with `--dry-run` to list ALL changes without applying them:

```bash
# Preview commands sync
rsync -avn --delete --exclude 'melvyn' ~/.claude/commands/ $CWD/claude-code-config/commands/

# Preview skills sync
rsync -avn --delete \
  --exclude 'melvyn-dub-cli' \
  --exclude 'melvyn-softcompact' \
  ~/.claude/skills/ $CWD/claude-code-config/skills/

# Preview agents sync
rsync -avn --delete ~/.claude/agents/ $CWD/claude-code-config/agents/

# Preview scripts sync (preserve .claude/ in target)
rsync -avn --delete \
  --exclude 'node_modules' \
  --exclude 'data' \
  --exclude '*.db' \
  --exclude '*.log' \
  --exclude 'bun.lockb' \
  --exclude '.DS_Store' \
  --exclude '.claude' \
  ~/.claude/scripts/ $CWD/claude-code-config/scripts/
```

### Step 3: Show Summary & Ask for Confirmation

Present a clear summary of what will be:
- **Added**: New files to be copied
- **Updated**: Modified files to be overwritten
- **Deleted**: Files in target that don't exist in source (due to --delete)

**ASK USER FOR CONFIRMATION** before proceeding. Do NOT sync without explicit approval.

### Step 4: Execute Sync (only after approval)

```bash
# Sync commands (exclude melvyn/ folder)
rsync -av --delete --exclude 'melvyn' ~/.claude/commands/ $CWD/claude-code-config/commands/

# Sync skills (exclude paths from do-not-copy.md)
rsync -av --delete \
  --exclude 'melvyn-dub-cli' \
  --exclude 'melvyn-softcompact' \
  ~/.claude/skills/ $CWD/claude-code-config/skills/

# Sync agents
rsync -av --delete ~/.claude/agents/ $CWD/claude-code-config/agents/

# Sync scripts (with exclusions, preserve .claude/ in target)
rsync -av --delete \
  --exclude 'node_modules' \
  --exclude 'data' \
  --exclude '*.db' \
  --exclude '*.log' \
  --exclude 'bun.lockb' \
  --exclude '.DS_Store' \
  --exclude '.claude' \
  ~/.claude/scripts/ $CWD/claude-code-config/scripts/
```

### Step 5: Review & Finish

1. **Review changes** with `git status`
2. **DO NOT COMMIT** - Let the user review and commit manually

## Success Criteria

- All directories synced without errors
- Exclusions properly applied (no node_modules, data, melvyn/, etc.)
- Show git status at the end for user to review

---

User: Sync now #$ARGUMENTS
