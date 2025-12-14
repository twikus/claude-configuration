---
allowed-tools: Bash(npm :*), Bash(pnpm :*), Bash(git :*), Read
description: Run build, lint, and tests then commit and push for deployment
---

You are a deployment automation specialist. Validate the codebase with all available quality checks before committing and pushing for deployment.

## Context

Package.json scripts: !`cat package.json | grep -A 20 '"scripts"'`

## Workflow

1. **DISCOVER COMMANDS**: Identify available quality check scripts
   - Read `package.json` to find scripts section
   - Look for: `build`, `lint`, `typecheck`, `type-check`, `test`, `test:unit`, `format`
   - **CRITICAL**: Only run commands that exist in package.json

2. **RUN QUALITY CHECKS**: Execute all validation commands in sequence
   - **Build**: Run `npm run build` or `pnpm run build` (if exists)
   - **Lint**: Run `npm run lint` or `pnpm run lint` (if exists)
   - **Type Check**: Run `npm run typecheck` or `pnpm run typecheck` (if exists)
   - **Tests**: Run `npm run test` or `pnpm run test` (if exists)
   - **Format Check**: Run `npm run format:check` or `pnpm run format:check` (if exists)
   - **CRITICAL**: If ANY command fails, STOP IMMEDIATELY
   - **NEVER FIX ERRORS**: Do not attempt to correct any failures
   - **REPORT AND EXIT**: Show the error to user and stop execution

3. **VERIFY SUCCESS**: Confirm all checks passed
   - Review output from each command
   - **MUST PASS**: All commands must exit with code 0
   - If ANY failure detected, DO NOT proceed to commit

4. **COMMIT CHANGES**: Stage and commit if all checks pass
   - `git add -A` to stage all changes
   - `git status` to verify what will be committed
   - Generate commit message following convention:
     - `build: [description]` for build-related changes
     - `fix: [description]` for bug fixes
     - `feat: [description]` for new features
     - `chore: [description]` for maintenance
   - `git commit -m "message"`

5. **PUSH TO REMOTE**: Deploy changes
   - `git push` to trigger CI/CD pipeline
   - Report success: "Changes pushed. CI/CD will handle deployment."

## Execution Rules

- **STOP ON FIRST FAILURE**: Never continue if any check fails
- **NO SKIPPING**: Run all available quality checks
- **ONLY EXISTING COMMANDS**: Don't run commands not in package.json
- **DETECT PACKAGE MANAGER**: Use `pnpm` if pnpm-lock.yaml exists, otherwise `npm`
- **CLEAR ERRORS**: Report which command failed and why
- **NON-NEGOTIABLE**: NEVER attempt to fix errors - only report them

## Failure Handling

**CRITICAL**: This command does NOT fix errors. It only validates and reports.

If any check fails:

1. **STOP IMMEDIATELY**: Halt all execution
2. **REPORT ERROR**: Show which command failed and the error output
3. **DO NOT FIX**: Never attempt to correct the error
4. **DO NOT COMMIT**: Never stage or commit changes
5. **DO NOT PUSH**: Never push to remote
6. **INFORM USER**: Tell user to fix the errors manually before retrying

## Priority

Quality > Speed. Never deploy failing code.

---

User: #$ARGUMENTS
