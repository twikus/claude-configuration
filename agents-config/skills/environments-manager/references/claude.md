# Claude Code Linking

Wire the shared `scripts/worktree-up` and `scripts/worktree-down` into Claude Code's native worktree system.

## What Claude Code Actually Provides

Claude Code DOES have native worktree support. It is fired on real worktree creation, not on every session.

| Mechanism | What it does |
| :--- | :--- |
| `claude --worktree <name>` (or `-w`) | Creates worktree at `.claude/worktrees/<name>/` on branch `worktree-<name>` |
| `.worktreeinclude` file (gitignore syntax) | Auto-copies matching **gitignored** files (e.g. `.env`, `.env.local`) into every new worktree - **no scripting required** |
| `WorktreeCreate` hook | Runs ONCE when a worktree is created. **Replaces the default `git worktree add` behavior** - the hook script must call `git worktree add` itself and print the worktree path to stdout |
| `WorktreeRemove` hook | Runs when a worktree is being deleted. Receives `worktree_path` on stdin |
| `$CLAUDE_PROJECT_DIR` | Path to the source repo root inside hook scripts |

**Do NOT use `SessionStart` for worktree setup.** `SessionStart` fires on every new conversation in any worktree, not on worktree creation. It would rerun setup every time the user opens a session.

The "run once when worktree is created" hook is `WorktreeCreate` - that is the correct mechanism.

There is no separate `PostWorktreeCreate` hook (feature request #27744 is open). Because `WorktreeCreate` replaces the default git logic, the hook script must be responsible for both the `git worktree add` call AND the project setup.

## Files to Generate

```text
.worktreeinclude                  # gitignore-syntax list of files to auto-copy
.claude/
├── settings.json                 # WorktreeCreate + WorktreeRemove hooks
└── commands/                     # optional: per-action slash commands
    ├── dev.md
    ├── typecheck.md
    ├── test.md
    └── lint.md
scripts/
├── claude-worktree-create        # WorktreeCreate hook wrapper
├── claude-worktree-remove        # WorktreeRemove hook wrapper
└── (shared worktree-up / worktree-down / dev)
```

`.gitignore` must also include `**/.claude/worktrees/`.

## `.worktreeinclude`

If "Copy ignored env files" was selected in Step 1, **prefer `.worktreeinclude` over the bash `cp` loop** - it's native, zero-script, and runs on every worktree path (CLI `--worktree`, subagent worktrees, desktop parallel sessions).

```
.env
.env.local
.env.development.local
```

Only files matching a pattern **and** gitignored are copied. Tracked files are never duplicated.

## `.claude/settings.json`

```json
{
  "hooks": {
    "WorktreeCreate": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/claude-worktree-create"
          }
        ]
      }
    ],
    "WorktreeRemove": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/claude-worktree-remove"
          }
        ]
      }
    ]
  }
}
```

If the project already has a `settings.json`, **merge** the `hooks` block. Do not overwrite.

## `scripts/claude-worktree-create`

This wrapper exists because Claude's `WorktreeCreate` hook has three Claude-specific responsibilities the shared `scripts/worktree-up` cannot handle:

1. Call `git worktree add` itself (Claude does not do it).
2. Print the worktree path - and **only** the path - to stdout.
3. Send all progress output to `/dev/tty`, not stdout.

```bash
#!/usr/bin/env bash
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

# Run shared setup inside the worktree. Source path is the original repo.
# All output routed to /dev/tty so stdout stays clean.
if [[ -x "${REPO}/scripts/worktree-up" ]]; then
  (cd "$WORKTREE" && ROOT_WORKTREE_PATH="$REPO" bash "${REPO}/scripts/worktree-up") > /dev/tty 2>&1 || \
    log "worktree-up exited non-zero - check $WORKTREE/.worktree-setup.log"
fi

log "Worktree ready."

# THE ONLY THING ON STDOUT - Claude parses this as the cwd.
echo "$WORKTREE"
```

Note: `ROOT_WORKTREE_PATH` is set so the shared `scripts/worktree-up` can locate the source checkout via the existing cascade (`CODEX_SOURCE_TREE_PATH` → `ROOT_WORKTREE_PATH`).

## `scripts/claude-worktree-remove`

```bash
#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
WORKTREE=$(echo "$INPUT" | jq -r '.worktree_path')

[[ ! -d "$WORKTREE" ]] && exit 0

# Run shared cleanup before removing the git worktree.
if [[ -x "$(dirname "$0")/worktree-down" ]]; then
  (cd "$WORKTREE" && bash "$(dirname "$0")/worktree-down") > /dev/tty 2>&1 || true
fi

BRANCH=$(git -C "$WORKTREE" rev-parse --abbrev-ref HEAD 2>/dev/null || true)
git worktree remove "$WORKTREE" --force 2>/dev/null || true
[[ -n "$BRANCH" ]] && git branch -D "$BRANCH" 2>/dev/null || true
```

## Custom Slash Commands as Actions (optional)

Claude Code does not have a top-bar action menu. To expose the standard actions, write one file per action under `.claude/commands/`. Each is a tiny prompt that tells Claude to run the matching shared script or package-manager command.

See `examples/claude/commands/` for the four standard ones (`dev.md`, `typecheck.md`, `test.md`, `lint.md`).

## Guardrails

- **Never use `SessionStart` for one-time worktree setup** - it fires every session. Use `WorktreeCreate`.
- **Never let `git worktree add` write to stdout** in the `WorktreeCreate` hook - redirect with `>/dev/null 2>&1`. Anything on stdout besides the path breaks Claude's parser.
- **Read stdin once** with `INPUT=$(cat)` - stdin cannot be re-read.
- **Always merge** into the existing `.claude/settings.json`, never overwrite.
- The hook must live in `.claude/settings.json`, not `.claude/settings.local.json` - it must be checked in.
- Prefer `.worktreeinclude` over a bash `cp` loop for env files. Use the `cp` loop only when you need conditional or non-gitignored copies.
- Add `**/.claude/worktrees/` to `.gitignore` so worktree contents do not pollute the main repo's `git status`.

## Verification

```bash
python3 -c "import json; json.load(open('.claude/settings.json'))"
bash -n scripts/claude-worktree-create scripts/claude-worktree-remove
test -x scripts/claude-worktree-create scripts/claude-worktree-remove
grep -q '.claude/worktrees' .gitignore || echo "ADD: **/.claude/worktrees/ to .gitignore"
```

## Online References

- Run parallel sessions with worktrees: https://code.claude.com/docs/en/worktrees
- Hooks reference (WorktreeCreate, WorktreeRemove): https://code.claude.com/docs/en/hooks
- Community reference implementation: https://github.com/tfriedel/claude-worktree-hooks
- Open feature request for PostWorktreeCreate: https://github.com/anthropics/claude-code/issues/27744
