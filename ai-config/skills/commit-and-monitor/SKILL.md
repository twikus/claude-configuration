---
name: commit-and-monitor
description: Commit, push, then monitor Vercel deployment and GitHub Actions until green. Auto-fixes failures and retries. Use when committing code that needs deployment verification, or when you want to ship and verify in one command.
argument-hint: "[commit message]"
allowed-tools: Bash(git :*), Bash(gh :*), Bash(vercel :*), Bash(npm :*), Bash(pnpm :*), Bash(bun :*), Bash(npx :*), Bash(sleep :*)
---

# Commit and Monitor

Commit, push, then watch Vercel + GitHub Actions until everything is green. Fix and retry if anything fails.

## Context

- Git state: !`git status --short`
- Staged changes: !`git diff --cached --stat`
- Unstaged changes: !`git diff --stat`
- Recent commits: !`git log --oneline -5`
- Current branch: !`git branch --show-current`

## Phase 1: Commit & Push

1. **Analyze git state**
   - Nothing staged but unstaged changes exist: `git add .`
   - Nothing to commit: inform user and exit
   - If `$ARGUMENTS` provided, use it as commit message
   - Otherwise generate: `type(scope): brief description` (under 72 chars, imperative mood)

2. **Commit**: `git commit -m "message"`

3. **Push**: `git push` (set upstream if needed with `git push -u origin $(git branch --show-current)`)

## Phase 2: Monitor Vercel Deployment

1. **Get latest deployment** for current branch:
   ```bash
   vercel list --limit 5 2>/dev/null
   ```

2. **Wait for deployment to complete** using `vercel inspect --wait`:
   ```bash
   vercel inspect <deployment-url> --wait --timeout 10m
   ```
   This blocks until the deployment reaches Ready or Error state. No polling needed.

3. **On build error**: Fetch logs with `vercel inspect <url> --logs`, analyze the error, fix locally, then go back to Phase 1.

4. **On success**: Note the preview URL and continue to Phase 3.

## Phase 3: Monitor GitHub Actions

1. **Check for running workflows**:
   ```bash
   gh run list --branch $(git branch --show-current) --limit 5
   ```

2. **Watch the latest run**:
   ```bash
   gh run watch <run-id> --exit-status
   ```
   This blocks until the run completes. If it exits non-zero, the run failed.

3. **On failure**: Get logs with `gh run view <run-id> --log-failed`, analyze error, fix locally, then go back to Phase 1.

4. **On success**: Continue to Phase 4.

## Phase 4: Final Verification

1. Confirm Vercel deployment is Ready
2. Confirm all GitHub Actions workflows passed
3. Check if a PR exists for current branch: `gh pr view --json state,url,checks 2>/dev/null`
4. If PR exists, verify all checks are passing
5. Report final status with:
   - Commit SHA
   - Vercel preview URL (if available)
   - GitHub Actions status
   - PR URL and check status (if applicable)

## Rules

- **NO INTERACTION during commit**: Generate one good message and commit immediately
- **AUTO-STAGE**: If nothing staged, stage everything
- **AUTO-PUSH**: Always push after committing
- **MAX 5 FIX ATTEMPTS**: After 5 failed fix cycles, stop and report what's wrong
- **ZERO TOLERANCE FOR HACKS**: No `@ts-ignore`, `eslint-disable`, skipping tests, `--no-verify`
- **MINIMAL FIXES**: Only fix what's broken, don't refactor unrelated code
- **CLEAR FIX COMMITS**: Each fix gets its own commit with descriptive message like `fix(ci): resolve build error in X`
- **NO POLLING**: Use `vercel inspect --wait --timeout 10m` to block until deployment completes
- **TIMEOUT**: If Vercel hasn't completed after 10 minutes, warn user
- **IMPERATIVE MOOD**: "add", "update", "fix" - not past tense
