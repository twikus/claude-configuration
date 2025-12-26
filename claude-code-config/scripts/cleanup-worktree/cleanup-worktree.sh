#!/bin/bash

# Clean up Git worktrees with merged PRs or deleted branches

# Fetch latest remote information
echo "Fetching remote information..."
git fetch --all --prune

# Get all worktrees except main
worktrees=$(git worktree list --porcelain | grep -B1 "^branch " | grep "^worktree " | grep -v "$(pwd)$" | cut -d' ' -f2-)

# Process each worktree
for worktree in $worktrees; do
    # Get branch name for this worktree
    branch=$(git worktree list --porcelain | grep -A1 "^worktree $worktree$" | grep "^branch " | sed 's/^branch refs\/heads\///')
    
    if [ -z "$branch" ]; then
        continue
    fi
    
    echo "Checking: $branch"
    
    # Check if branch exists on remote
    if ! git ls-remote --heads origin "$branch" | grep -q .; then
        echo "  → Branch deleted from remote, removing worktree"
        git worktree remove "$worktree" --force
        continue
    fi
    
    # Check if PR is merged
    merged_pr=$(gh pr list --state merged --head "$branch" --json number --jq '.[0].number' 2>/dev/null || echo "")
    if [ -n "$merged_pr" ]; then
        echo "  → PR #$merged_pr merged, removing worktree"
        git worktree remove "$worktree" --force
    fi
done

# Clean up any stale references
git worktree prune

echo "Done! Remaining worktrees:"
git worktree list