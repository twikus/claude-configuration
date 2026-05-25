#!/usr/bin/env bash
# Claude Code WorktreeCreate hook wrapper.
# Replaces default `git worktree add` behavior, then runs the shared scripts/worktree-up.
#
# stdin contract:  JSON with { "name": "<worktree-name>", ... }
# stdout contract: the absolute worktree path and NOTHING ELSE.
# Progress output goes to /dev/tty.

set -euo pipefail

INPUT=$(cat)
NAME=$(echo "$INPUT" | jq -r '.name')
REPO="$CLAUDE_PROJECT_DIR"
WORKTREE="${REPO}/.claude/worktrees/${NAME}"
BRANCH="worktree-${NAME}"

log() { echo "$*" > /dev/tty 2>/dev/null || true; }

log "Creating worktree (branch: $BRANCH)..."

mkdir -p "${REPO}/.claude/worktrees"
if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git worktree add "$WORKTREE" "$BRANCH" >/dev/null 2>&1
else
  git worktree add -b "$BRANCH" "$WORKTREE" HEAD >/dev/null 2>&1
fi

if [[ -x "${REPO}/scripts/worktree-up" ]]; then
  (cd "$WORKTREE" && ROOT_WORKTREE_PATH="$REPO" bash "${REPO}/scripts/worktree-up") > /dev/tty 2>&1 || \
    log "worktree-up exited non-zero - check $WORKTREE/.worktree-setup.log"
fi

log "Worktree ready."

# THE ONLY THING ON STDOUT.
echo "$WORKTREE"
