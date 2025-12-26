# Cleanup Worktree Script

This script automatically cleans up Git worktrees for branches that have been merged or deleted from the remote repository.

## What it does

1. **Fetches remote information** to get the latest state
2. **Identifies worktrees** linked to deleted remote branches
3. **Finds merged PRs** using GitHub CLI
4. **Removes worktrees** for merged or deleted branches
5. **Prunes stale references** to keep Git clean

## Usage

```bash
./cleanup-worktree.sh
```

Run this script from your main project directory (not from within a worktree).

## Requirements

- Git worktree support
- GitHub CLI (`gh`) installed and authenticated
- `jq` for JSON parsing (used by gh CLI)

## What gets cleaned up

- **Merged PRs**: Worktrees where the associated PR has been merged
- **Deleted branches**: Worktrees where the remote branch no longer exists
- **Stale references**: Git references that are no longer valid

## Safety features

- **Preserves main worktree**: Never removes the main repository directory
- **Checks remote state**: Verifies branch status before removal
- **Force removal**: Uses `--force` flag to handle uncommitted changes
- **Comprehensive cleanup**: Runs `git worktree prune` to clean references

## Customization

### Change remote name
If you use a different remote name than `origin`, modify line 24:
```bash
if ! git ls-remote --heads upstream "$branch" | grep -q .; then
```

### Add confirmation prompts
To add confirmation before removing each worktree:
```bash
echo "  → Branch deleted from remote, remove worktree? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    git worktree remove "$worktree" --force
fi
```

### Skip certain branches
To protect specific branches from cleanup:
```bash
# Skip branches matching patterns
if [[ "$branch" =~ ^(main|develop|staging)$ ]]; then
    echo "  → Skipping protected branch: $branch"
    continue
fi
```

## Claude Code Integration

Create a slash command for this script:

```markdown
---
description: Clean up merged or deleted Git worktrees
---

# Cleanup Worktrees

Remove Git worktrees for branches that have been merged or deleted from remote.

!~/.claude/scripts/cleanup-worktree/cleanup-worktree.sh
```

## Automation

### Daily cleanup with cron
Add to your crontab (`crontab -e`):
```bash
# Clean up worktrees daily at 9 AM
0 9 * * * cd /path/to/your/project && ~/.claude/scripts/cleanup-worktree/cleanup-worktree.sh
```

### Git alias
Add to your `.gitconfig`:
```bash
[alias]
    cleanup-worktrees = !~/.claude/scripts/cleanup-worktree/cleanup-worktree.sh
```

Then use: `git cleanup-worktrees`

## Troubleshooting

**Permission errors:**
- Make the script executable: `chmod +x cleanup-worktree.sh`
- Ensure you have write permissions to worktree directories

**GitHub CLI errors:**
- Check authentication: `gh auth status`
- Verify repository access: `gh repo view`

**Network issues:**
- Check internet connectivity
- Verify GitHub.com accessibility
- Try running `git fetch` manually first