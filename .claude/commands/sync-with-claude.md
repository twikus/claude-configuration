---
allowed-tools: Bash(cp :*), Bash(diff :*), Bash(ls :*), Bash(cat :*), Bash(mkdir :*), Bash(git :*), Bash(find :*), Bash(date :*), Bash(rsync :*), Bash(rm :*), Read, Write, Edit
description: Sync files from ~/.claude to claude-code-config repository
---

<objective>
Sync configuration files from ~/.claude to claude-code-config folder in this repository.
This ensures the repository has an up-to-date copy of Claude Code configurations.
</objective>

<configuration>
- **Source**: `~/.claude`
- **Target**: `$CWD/claude-code-config`
</configuration>

<directories_to_sync>
1. **commands/** - Slash commands (.md files and subdirectories)
2. **skills/** - Skills (subdirectories with SKILL.md)
3. **agents/** - Agent definitions (.md files)
4. **scripts/** - All script projects (statusline, command-validator, auto-rename-session, claude-code-ai, etc.)
</directories_to_sync>

<exclusions>
Always exclude these from sync:
- `node_modules/` - Dependencies (reinstall locally)
- `data/` - Runtime data
- `*.db` - Database files
- `*.log` - Log files
- `bun.lockb` - Lock files
- `.DS_Store` - macOS files
</exclusions>

<process>
1. **Sync each directory** using rsync with proper exclusions:

```bash
# Sync commands
rsync -av --delete ~/.claude/commands/ $CWD/claude-code-config/commands/

# Sync skills
rsync -av --delete ~/.claude/skills/ $CWD/claude-code-config/skills/

# Sync agents
rsync -av --delete ~/.claude/agents/ $CWD/claude-code-config/agents/

# Sync scripts (with exclusions)
rsync -av --delete \
  --exclude 'node_modules' \
  --exclude 'data' \
  --exclude '*.db' \
  --exclude '*.log' \
  --exclude 'bun.lockb' \
  --exclude '.DS_Store' \
  ~/.claude/scripts/ $CWD/claude-code-config/scripts/
```

2. **Review changes** with git status
3. **Commit** with descriptive message
</process>

<success_criteria>
- All directories synced without errors
- Exclusions properly applied (no node_modules, data, etc.)
- Changes committed to git
</success_criteria>

User: Sync now #$ARGUMENTS
