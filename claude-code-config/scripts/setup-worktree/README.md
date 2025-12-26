# Setup Worktree Script

This script automates the creation of Git worktrees for feature development based on GitHub issues.

## What it does

1. **Generates branch names** using Claude CLI from GitHub issue content
2. **Creates isolated worktrees** in `~/Developer/worktrees/`
3. **Copies environment files** (.env\*) to the new worktree
4. **Installs dependencies** (pnpm/yarn/npm)
5. **Generates Prisma schemas** for database projects
6. **Opens terminal** with Claude in plan mode for the issue

## Usage

```bash
./setup-worktree.sh <github-issue-url>
```

**Example:**

```bash
./setup-worktree.sh https://github.com/Melvynx/saveit.now/issues/18
```

## Requirements

- Git worktree support
- GitHub CLI (`gh`) installed and authenticated
- Claude CLI installed and authenticated
- `jq` for JSON parsing
- `pnpm` (or yarn/npm) for dependency management
- Ghostty terminal (can be modified for other terminals)

## Customization

### Change terminal application

Modify lines 96-110 to use your preferred terminal:

```bash
# For iTerm2
osascript -e "
    tell application \"iTerm\"
        create window with default profile
        tell current session of current window
            write text \"cd '$WORKTREE_PATH' && claude --permission-mode plan '/run-tasks $ISSUE_URL'\"
        end tell
    end tell
"
```

### Change worktree location

Modify line 38:

```bash
WORKTREE_PATH="$HOME/your-preferred-path/${PROJECT_NAME}-worktrees/$FEATURE_NAME"
```

### Change package manager

Modify line 72:

```bash
npm install  # or yarn install
```

### Add custom setup steps

Add your custom setup after line 92:

```bash
# Custom setup steps
echo "🔧 Running custom setup..."
# Add your commands here
```

## Claude Code Integration

To use this script with Claude Code, you can create a slash command:

```markdown
---
description: Setup a Git worktree for a GitHub issue
---

# Setup Worktree

Create a new Git worktree for feature development based on a GitHub issue.

Run the setup script for: #$ARGUMENTS

!~/.claude/scripts/setup-worktree/setup-worktree.sh #$ARGUMENTS
```

## Troubleshooting

**Branch name generation fails:**

- Check Claude CLI authentication
- Verify GitHub issue URL format
- Ensure `gh` CLI is authenticated

**Permission errors:**

- Make the script executable: `chmod +x setup-worktree.sh`
- Check file permissions in target directory

**Dependency installation fails:**

- Verify package manager is installed
- Check network connectivity
- Ensure package.json exists in project
