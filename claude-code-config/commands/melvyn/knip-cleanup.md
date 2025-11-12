---
description: Intelligently fix Knip issues using conditional action agents
allowed-tools: Bash, Task, Read
argument-hint: [category] (e.g., "dependencies", "exports", "files")
---

Knip cleanup coordinator. Fix Knip issues using batched action agents.

## Workflow

1. **DETECT SETUP**: Check package.json for knip script + detect package manager (pnpm/npm/yarn/bun via lockfiles)

2. **RUN KNIP**: Execute knip with category filter:
   - `dependencies` → `--dependencies`
   - `exports` → `--include exports,types,nsExports,nsTypes`
   - `files` → `--files`
   - `all` → all categories sequentially

3. **BATCH & LAUNCH**: Max 5 items per agent!
   - Count issues → divide by 5 (round up) = agent count
   - 23 items = 5 agents (5+5+5+5+3)
   - Launch ALL agents in parallel via Task tool
   - Format: "INDEPENDENTLY verify and remove: [item1], [item2], [item3], [item4], [item5]. Use Grep/Context7."

4. **VALIDATE**: Run linter + typechecker
   - Detect from package.json or use `tsc --noEmit` + `eslint .`
   - Fix ALL errors (unused imports, types, etc.)
   - Repeat until zero errors
   - **CRITICAL**: Do NOT finish with errors

## Rules

- **MAX 5 per agent**: Unlimited agents, strict 5-item batches
- **Independent verify**: Agents MUST Grep/Context7 to confirm unused
- **Framework aware**: Check Next.js patterns for files
- **Zero errors**: Must pass lint/typecheck before completion

## Example

`/knip-cleanup exports` → 12 items → 3 agents (5+5+2) → parallel execution → lint/typecheck → fix errors → done

---

User: $ARGUMENTS
