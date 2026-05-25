# Cursor Linking

Wire the shared `scripts/worktree-up`, `scripts/worktree-down`, and `scripts/dev` into Cursor.

## What Cursor Provides

Cursor has native worktree support via `.cursor/worktrees.json`. The file is searched first in the worktree, then in the project root.

Three setup keys are supported (Cursor picks the first one that matches the host OS):

- `setup-worktree-unix` - macOS/Linux (string filepath or array of commands)
- `setup-worktree-windows` - Windows (string filepath or array of commands)
- `setup-worktree` - generic fallback

Cursor does **not** support a cleanup script. Cleanup is timer-based via global settings (`cursor.worktreeCleanupIntervalHours`, `cursor.worktreeMaxCount`). To get a real cleanup hook, expose `scripts/worktree-down` as a project command the user runs manually before `/delete-worktree`.

Built-in worktree slash commands the user already has: `/worktree`, `/best-of-n`, `/apply-worktree`, `/delete-worktree`.

## Environment Variables

Only one variable is documented:

- `$ROOT_WORKTREE_PATH` - absolute path to the root of the original checkout
- (On Windows: `%ROOT_WORKTREE_PATH%`)

The worktree path itself is just `pwd` inside the worktree.

## Files to Generate

```text
.cursor/
└── worktrees.json
```

That is it. No actions menu, no per-IDE command files - Cursor wires the setup script and stops.

## `.cursor/worktrees.json`

Preferred shape: point Cursor at the script files. Keep arrays only as a last resort.

```json
{
  "setup-worktree-unix": "../scripts/worktree-up"
}
```

The path is relative to the location of `.cursor/worktrees.json`. From `.cursor/worktrees.json` at the project root, `scripts/worktree-up` is at `../scripts/worktree-up`.

If the project also needs Windows support, add the second key:

```json
{
  "setup-worktree-unix": "../scripts/worktree-up",
  "setup-worktree-windows": "../scripts/worktree-up.ps1"
}
```

If the user does not want a separate script and prefers inline commands:

```json
{
  "setup-worktree": [
    "cp $ROOT_WORKTREE_PATH/.env .env",
    "pnpm install"
  ]
}
```

Inline is fine for two-line setups. For anything more, use a script - the worktree-up logic from the parent skill belongs in `scripts/worktree-up`, not in JSON.

## Guardrails

- Do not put fragile multi-line setup inline. If it does not fit in two clean array entries, call the script.
- Do not put `.cursor/worktrees.json` only in a worktree - it must be on the source checkout / main branch so future worktrees pick it up.
- Do not rely on a cleanup hook - Cursor does not have one. Tell the user to run `scripts/worktree-down` before `/delete-worktree`, or document it in the project README.
- Do not use `$CURSOR_WORKTREE_PATH` - that variable is not documented and not guaranteed. Use `pwd` inside the worktree.

## Verification

```bash
python3 -c "import json; json.load(open('.cursor/worktrees.json'))"
test -x scripts/worktree-up
```

## Online References

- Cursor Worktrees docs: https://cursor.com/docs/configuration/worktrees
- Cursor 3 worktrees release notes: https://forum.cursor.com/t/cursor-3-worktrees-best-of-n
