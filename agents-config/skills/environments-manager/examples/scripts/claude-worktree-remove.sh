#!/usr/bin/env bash
# Claude Code WorktreeRemove hook wrapper.
# Runs scripts/worktree-down for cleanup, then removes the git worktree and branch.
#
# stdin contract: JSON with { "worktree_path": "<absolute-path>", ... }

set -euo pipefail

INPUT=$(cat)
WORKTREE=$(echo "$INPUT" | jq -r '.worktree_path')

[[ ! -d "$WORKTREE" ]] && exit 0

SCRIPT_DIR=$(dirname "$0")
if [[ -x "${SCRIPT_DIR}/worktree-down" ]]; then
  (cd "$WORKTREE" && bash "${SCRIPT_DIR}/worktree-down") > /dev/tty 2>&1 || true
fi

BRANCH=$(git -C "$WORKTREE" rev-parse --abbrev-ref HEAD 2>/dev/null || true)
git worktree remove "$WORKTREE" --force 2>/dev/null || true
[[ -n "$BRANCH" ]] && git branch -D "$BRANCH" 2>/dev/null || true
