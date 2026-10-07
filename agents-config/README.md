# AIBlueprint Premium configuration

This directory contains the Premium skills installed by `agents pro setup`.
The CLI copies every complete skill directory from `agents-config/skills` into
the shared `~/.agents/skills` directory, including its references, scripts,
agents, and assets.

## Frontend routing skills

The Premium configuration includes three model-invoked frontend routers by
default:

| Skill | Purpose |
| --- | --- |
| `better` | Reviews an interface holistically, then routes work across accessibility, layout, writing, typography, colors, and UI polish. |
| `animate` | Routes motion work to focused animation design, implementation, review, performance, accessibility, and prototyping guidance. |
| `impeccable` | Routes production frontend work across building, evaluating, refining, hardening, optimizing, adapting, and animating interfaces. |

These routers can activate from the user's request because they do not disable
model invocation. Their internal guides remain references used by the router,
not additional standalone skills exposed to the user.

Other routing and orchestration skills already included in Premium are `apex`,
`use-style`, and `use-delegate`.

## Packaging

Each skill must remain a complete directory. When a skill depends on files such
as `reference/`, `scripts/`, `agents/`, or `assets/`, those files are shipped
with its `SKILL.md` and installed together by the CLI.

## Mods

Premium ships Claude Code mods in `agents-config/claude-config/mods`. The CLI
copies them to `~/.claude/mods/`, and `settings.json` enables them with
`CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` and `CLAUDE_CODE_PLUGIN_DIRS`.

| Mod | Purpose |
| --- | --- |
| `agent4everything` | Links every `.agents/skills` skill (global and per project) into `.claude/skills` without duplicating existing ones. |
| `aiblueprint` | Usage band above the prompt: session context and cost, 5-hour and weekly limits with pace and reset time. The ⚙ chip toggles each part. It also seeds the statusline's limits cache. |
| `portly-ports` | Shows Portly's running ports in the status line; `/portly-ports` toggles it. Stays silent when Portly is not installed. |
| `cache-line` | Prompt-cache meter above the prompt (hit rate, countdown, prompt size); `/cache` opens the per-turn table. MIT, by claude-code-templates. |

Each mod ships `.claude-plugin/plugin.json`, `hooks/`, and its `types/` contract when it has one. Run
`claude plugin validate <mod folder>` after editing one.

## Scripts

`settings.json` wires two Bun scripts installed into `~/.claude/scripts/`:

| Script | Wired as | Purpose |
| --- | --- | --- |
| `statusline` | `statusLine` | Git, session, context and usage limits in the Claude Code statusline. |
| `command-validator` | `hooks.PreToolUse` on `Bash` | Denies `rm -rf` (use `trash`), asks before `sudo`, `su`, `chmod`, `chown`, `dd`, `mkfs`, `fdisk`. Events are logged to `command-validator/data/security.log`. |

Run `bun test command-validator` from `~/.claude/scripts` after editing the validator.
