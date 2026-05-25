---
name: environments-manager
description: Set up a per-worktree environment for one or more IDEs (Claude Code, Cursor, Codex) in a single pass. Generates shared scripts/worktree-up, scripts/worktree-down, and scripts/dev, then wires them into each selected IDE's config. Use whenever the user asks to "set up a worktree environment", "configure worktrees", "make this repo worktree-ready", or mentions any of .codex/environments/environment.toml, .cursor/worktrees.json, .claude/settings.json SessionStart, $CODEX_WORKTREE_PATH, $ROOT_WORKTREE_PATH, or $CLAUDE_PROJECT_DIR.
disable-model-invocation: false
allow_implicit_invocation: true
---

# Environments Manager

Set up per-worktree environments so a fresh worktree is instantly ready to run: env files copied, dependencies installed, isolated database created, and common commands one click away. Supports Claude Code, Cursor, and Codex - the **shared scripts are the same on every IDE**; only the config file that points at them differs.

## Interactive Flow

This skill is interactive. Ask the user the two questions below before writing anything - the right setup depends on the project. Use whichever interactive question tool the host harness provides (in Claude Code: `AskUserQuestion`; in Codex/Cursor: a plain prompt). Do not assume answers.

### Step 1: What should happen in a fresh worktree?

Ask the user what the setup script should do, as a multi-select. The first option is the default-on baseline; the rest are additive opt-ins:

| Option | What it adds to `scripts/worktree-up` |
| :--- | :--- |
| Copy ignored env files from the source checkout | `cp` of `.env`, `.env.local`, `.env.development.local` (default - almost always wanted) |
| Install dependencies | `pnpm install` / `bun install` / `npm install` based on lockfile |
| Create an isolated database for this worktree | Build a unique DB name from the worktree dir, rewrite `DATABASE_URL` in `.env`, run `createdb` + import |
| Run codegen (Prisma, Drizzle, generated types) | `pnpm prisma:generate` / `bun run db:generate` / etc. |

If the user has project-specific steps (seed data, S3 sync, etc.), ask a follow-up free-form question to capture them.

### Step 2: Which IDEs should be wired up?

Ask a multi-select with options: Claude Code, Cursor, Codex. The user can pick any combination - the shared `scripts/` directory only gets generated once.

### Step 3: Apply each selected IDE

For each selected IDE, read the matching reference file and apply only its linking config. Do not duplicate the script logic - the IDE config just points at `scripts/worktree-up`, `scripts/worktree-down`, and `scripts/dev`.

- Claude Code → load `references/claude.md`
- Cursor → load `references/cursor.md`
- Codex → load `references/codex.md`

## Shared Shape

Every project that uses this skill ends up with:

```text
scripts/
├── worktree-up           # idempotent setup
├── worktree-down         # cleanup before worktree teardown
├── dev                   # start dev server on a free port
└── (project-specific helpers)
```

Plus one or more IDE config files (see references). The IDE config is thin; all logic lives in `scripts/`.

## Environment Variable Cascade

Each IDE exposes a different variable for the worktree path. The shared scripts must accept all three, in this priority:

```bash
WORKTREE_PATH="${CODEX_WORKTREE_PATH:-${CURSOR_WORKTREE_PATH:-${CLAUDE_PROJECT_DIR:-$(pwd)}}}"
SOURCE_PATH="${CODEX_SOURCE_TREE_PATH:-${ROOT_WORKTREE_PATH:-}}"
```

| Platform | Worktree path | Source checkout path |
| :------- | :----------------------- | :------------------------ |
| Codex    | `$CODEX_WORKTREE_PATH`   | `$CODEX_SOURCE_TREE_PATH` |
| Cursor   | `pwd` inside worktree    | `$ROOT_WORKTREE_PATH`     |
| Claude   | `$CLAUDE_PROJECT_DIR`    | (not provided - fall back to a project-specific path) |

If neither yields a source checkout, fall back to a project-specific absolute path the user provides, for example `$HOME/Developer/saas/<repo>`. Ask the user for it during Step 1 if you cannot infer it.

## `scripts/worktree-up`

Setup must be **idempotent** - reruns are safe. Built from the user's Step 1 selections. Required behavior in order:

1. `set -euo pipefail`.
2. Resolve `WORKTREE_PATH` and `SOURCE_PATH`.
3. `cd "$WORKTREE_PATH"`.
4. If "Copy env files" selected: copy `.env`, `.env.local`, `.env.development.local` only when the source has them and the worktree does not.
5. If "Install dependencies" selected: detect from lockfile and run the matching install.
6. If "Isolated database" selected: build a DB name from `basename "$WORKTREE_PATH" | tr '/' '-'`, rewrite only `DATABASE_URL` (and any related vars) in the copied `.env`, create the DB if missing. Provide a reset escape hatch: `<PROJECT>_RESET_DB=1` drops and recreates.
7. If "Codegen" selected: run the project's codegen command.
8. Append any free-form project-specific steps from Step 1.

Reference template (adjust based on selections):

```bash
#!/usr/bin/env bash
set -euo pipefail

WORKTREE_PATH="${CODEX_WORKTREE_PATH:-${CURSOR_WORKTREE_PATH:-${CLAUDE_PROJECT_DIR:-$(pwd)}}}"
SOURCE_PATH="${CODEX_SOURCE_TREE_PATH:-${ROOT_WORKTREE_PATH:-$HOME/Developer/saas/<repo>}}"

cd "$WORKTREE_PATH"

# Copy ignored env files
for f in .env .env.local .env.development.local; do
  if [[ -f "$SOURCE_PATH/$f" && ! -f "$WORKTREE_PATH/$f" ]]; then
    cp "$SOURCE_PATH/$f" "$WORKTREE_PATH/$f"
    echo "copied $f"
  fi
done

# Install deps
if   [[ -f pnpm-lock.yaml ]]; then pnpm install
elif [[ -f bun.lock || -f bun.lockb ]]; then bun install
elif [[ -f yarn.lock ]]; then yarn install
elif [[ -f package-lock.json ]]; then npm install
fi

# Project-specific DB isolation and codegen go here.
```

## `scripts/worktree-down`

Cleanup runs before the IDE destroys the worktree.

1. `set -euo pipefail`.
2. `cd "$WORKTREE_PATH"`.
3. Read DB names from the worktree `.env`. **Never guess from branch names.**
4. `dropdb --if-exists` per DB found, against a maintenance database.
5. Remove copied env files.
6. If env files or PostgreSQL tools are missing, print one short message and exit 0.

```bash
#!/usr/bin/env bash
set -euo pipefail

WORKTREE_PATH="${CODEX_WORKTREE_PATH:-${CURSOR_WORKTREE_PATH:-${CLAUDE_PROJECT_DIR:-$(pwd)}}}"
cd "$WORKTREE_PATH"

if [[ ! -f .env ]]; then
  echo "no .env in worktree, nothing to clean"
  exit 0
fi

db_name=$(grep -E '^DATABASE_URL=' .env | sed -E 's|.*/([^/?]+).*|\1|' | head -n1 || true)
if [[ -n "${db_name:-}" ]] && command -v dropdb >/dev/null 2>&1; then
  dropdb --if-exists -d postgres "$db_name" || true
fi

rm -f .env .env.local .env.development.local
```

## `scripts/dev`

Pick a free port so multiple worktrees can run in parallel.

```bash
#!/usr/bin/env bash
set -euo pipefail

WORKTREE_PATH="${CODEX_WORKTREE_PATH:-${CURSOR_WORKTREE_PATH:-${CLAUDE_PROJECT_DIR:-$(pwd)}}}"
cd "$WORKTREE_PATH"

port="${DEV_PORT_START:-3910}"
while lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; do
  port=$((port + 1))
done

echo "Starting app on http://localhost:$port"
exec pnpm dev -p "$port"  # adjust for the project package manager
```

## Standard Actions

Every project should expose these four actions through the IDE's own mechanism (see references). Wire them per IDE.

| Action     | Command (typical)                |
| :--------- | :------------------------------- |
| Dev        | `scripts/dev`                    |
| Typecheck  | `pnpm ts` / `bun run typecheck`  |
| Unit tests | `pnpm test:ci` / `bun test`      |
| Lint       | `pnpm lint:ci` / `bun run lint`  |

Add `E2E` as an action only if the suite is cheap enough to run interactively.

## Universal Guardrails

- Never commit secrets. Copying ignored env files into a local worktree is fine; logging them is not.
- Never drop a database whose name was guessed from a branch. Read it from the worktree `.env`.
- Never put fragile multi-line shell programs inside an IDE config file. Keep all logic in `scripts/`; the IDE config just calls those scripts.
- Never hardcode a dev port. Pick a free one starting from `${DEV_PORT_START:-3910}`.
- Setup must be idempotent. Provide a reset escape hatch via env var (`<PROJECT>_RESET_DB=1`).
- Print DB names and redacted hosts only.
- The scripts and IDE config must live on the source checkout / main branch, not only the current worktree, or future worktrees will have nothing to copy.

## Verification

After generating files:

```bash
bash -n scripts/worktree-up scripts/worktree-down scripts/dev
git status --short
```

If Python 3.11+ is available, validate any generated TOML:

```bash
python3 - <<'PY'
import tomllib
with open(".codex/environments/environment.toml", "rb") as f:
    tomllib.load(f)
PY
```

For JSON configs:

```bash
python3 -c "import json; json.load(open('.cursor/worktrees.json'))"
python3 -c "import json; json.load(open('.claude/settings.json'))"
```

## IDE-Specific Linking

After the shared scripts are written, for each IDE selected in Step 2, load the matching reference file and apply only its linking config:

- **Claude Code** → [references/claude.md](references/claude.md) - `.claude/settings.json` SessionStart hook + custom slash commands as actions.
- **Cursor** → [references/cursor.md](references/cursor.md) - `.cursor/worktrees.json` setup keys.
- **Codex** → [references/codex.md](references/codex.md) - `.codex/environments/environment.toml` setup, cleanup, and actions.

If multiple IDEs were selected, generate `scripts/` once and then apply each reference in turn.

## Examples

Working copies of every file this skill generates live under [examples/](examples/). Use them as the source-of-truth shape when writing into a real project. Adapt the project section (package manager, DB name prefix, codegen step) for the target repo.

```text
examples/
├── scripts/
│   ├── worktree-up         # pnpm + Postgres + Prisma reference
│   ├── worktree-down       # pnpm + Postgres reference
│   └── dev                 # free-port dev server reference
├── claude/
│   ├── settings.json       # SessionStart hook reference
│   └── commands/
│       ├── dev.md
│       ├── typecheck.md
│       ├── test.md
│       ├── lint.md
│       └── worktree-down.md
├── cursor/
│   └── worktrees.json      # setup-worktree-unix -> scripts/worktree-up
└── codex/
    └── environments/
        └── environment.toml # setup, cleanup, four actions
```

Read the relevant example before writing the file into the target project. Do not copy verbatim - the user's Step 1 selections determine which sections of `worktree-up` survive.
