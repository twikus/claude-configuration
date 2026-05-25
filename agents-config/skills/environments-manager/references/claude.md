# Claude Code Linking

Wire the shared `scripts/worktree-up`, `scripts/worktree-down`, and `scripts/dev` into Claude Code.

## What Claude Code Provides

Claude Code has no native "Local Environment" concept like Codex App. It does have:

1. **`SessionStart` hook** in `.claude/settings.json` - fires on session start (matchers: `startup`, `resume`, `clear`, `compact`). This is the closest equivalent to Codex's setup script.
2. **Custom slash commands** in `.claude/commands/<name>.md` - one-file commands the user invokes from the prompt. The closest equivalent to Codex actions.
3. **`$CLAUDE_PROJECT_DIR`** - absolute path to project root, available inside hooks and commands.

There is no built-in worktree-teardown event. The user invokes `scripts/worktree-down` manually via a `/worktree-down` slash command.

## Files to Generate

```text
.claude/
├── settings.json                # SessionStart hook -> scripts/worktree-up
└── commands/
    ├── dev.md
    ├── typecheck.md
    ├── test.md
    ├── lint.md
    └── worktree-down.md
```

## `.claude/settings.json`

Match only `startup|resume` so the hook does not rerun after an in-session `/clear` or auto-compact.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/scripts/worktree-up"
          }
        ]
      }
    ]
  }
}
```

If the project already has a `settings.json`, **merge** the `hooks.SessionStart` array - do not overwrite the file. Read it first, parse the JSON, append.

## Custom Slash Commands as Actions

Each action becomes one file in `.claude/commands/`. The body is the prompt Claude receives when the user types the slash command. Keep these files tiny; the work lives in the shell script.

`.claude/commands/dev.md`:

```markdown
---
description: Start the dev server on a free port
---

Run `scripts/dev` from the project root. Stream output until the dev server is listening, then return the URL.
```

`.claude/commands/typecheck.md`:

```markdown
---
description: Typecheck the project
---

Run the project's typecheck command (`pnpm ts`, `bun run typecheck`, or equivalent based on the lockfile). Report any errors with file:line references.
```

`.claude/commands/test.md`:

```markdown
---
description: Run unit tests
---

Run the project's unit test command (`pnpm test:ci`, `bun test`, or equivalent). Report failures with file:line references.
```

`.claude/commands/lint.md`:

```markdown
---
description: Run the linter
---

Run the project's lint command (`pnpm lint:ci`, `bun run lint`, or equivalent). Report any violations.
```

`.claude/commands/worktree-down.md`:

```markdown
---
description: Tear down this worktree's databases and copied env files
---

Run `scripts/worktree-down` from the project root. Report what was dropped or removed.
```

## Guardrails

- Do not put script bodies inside `settings.json`. The hook command must be a single call to `scripts/worktree-up`.
- Do not match `compact` or `clear` on the setup hook - those fire mid-session and would rerun setup unexpectedly.
- Do not overwrite the existing `.claude/settings.json`. Merge into the existing JSON.
- Do not write the hook into `.claude/settings.local.json` - it must be checked in so it works on every fresh worktree.
- Do not duplicate logic from `scripts/` into the slash command files. The command body should just tell Claude to run the script.

## Verification

```bash
python3 -c "import json; json.load(open('.claude/settings.json'))"
ls .claude/commands/
```

## Online References

- Claude Code hooks reference: https://code.claude.com/docs/en/hooks.md
- Custom slash commands: https://code.claude.com/docs/en/slash-commands
