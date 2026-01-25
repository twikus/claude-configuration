---
name: step-04-commit-push
description: Commit fixes and push, then loop back to watch CI
prev_step: steps/step-03-fix-locally.md
next_step: steps/step-01-watch-ci.md
---

# Step 4: Commit & Push

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 **NO HACKS OR BYPASSES** - If hooks fail, fix the issue properly
- 🛑 NEVER commit without `{local_verified}` = true
- 🛑 NEVER use `--no-verify` on commit
- 🛑 NEVER use `--force` push
- ✅ ALWAYS use descriptive commit messages
- ✅ ALWAYS let pre-commit hooks run
- ✅ ALWAYS push to trigger new CI run
- 📋 YOU ARE A COMMITTER, making clean commits
- 💬 FOCUS on committing and pushing only
- 🚫 FORBIDDEN to skip or bypass any hooks

---

## 🚫 FORBIDDEN ON COMMIT - NEVER DO THESE

- `git commit --no-verify` - Let hooks run and fix issues they find
- `git push --force` - Push normally
- `git commit --amend` to bypass - Create new commits
- Empty commit messages - Write descriptive messages
- Committing without local verification passing - Go back to step-03

## EXECUTION PROTOCOLS:

- 🎯 Stage → Commit → Push → Loop back to watch
- 💾 Track commit in `{fixes_applied}`
- 📖 Complete push before loading next step
- 🚫 FORBIDDEN to commit unverified changes

## CONTEXT BOUNDARIES:

From previous steps:

| Variable | Description |
|----------|-------------|
| `{auto_mode}` | Skip confirmations |
| `{branch}` | Current git branch |
| `{current_attempt}` | Current attempt number |
| `{local_verified}` | Must be true to proceed |
| `{fixes_applied}` | List of fixes applied |

## YOUR TASK:

Create a clean commit with all fixes, push to remote, and loop back to watch CI for the result.

---

## EXECUTION SEQUENCE:

### 1. Verify Pre-Conditions

**CRITICAL CHECK:**
```
IF {local_verified} != true:
    → STOP - cannot commit unverified changes
    → Return to step-03-fix-locally.md
```

### 2. Review Changes

Check what will be committed:
```bash
git status
git diff --stat
```

**Display summary:**
```
## Changes to Commit (Attempt {current_attempt})

Modified files:
- src/utils.ts (2 insertions, 1 deletion)
- tests/api.test.ts (5 insertions, 3 deletions)

Fixes included:
{list from fixes_applied}
```

### 3. Stage Changes

Stage all modified files:
```bash
git add -A
```

**Verify staging:**
```bash
git status --short
```

### 4. Create Commit

**Generate commit message from fixes:**

Format:
```
fix(ci): {brief description of primary fix}

{detailed list of fixes}

Attempt: {current_attempt}/{max_attempts}
```

**Commit with message:**
```bash
git commit -m "$(cat <<'EOF'
fix(ci): {description based on error_source}

{list of fixes_applied formatted nicely}
EOF
)"
```

**DO NOT use `--no-verify`** - let pre-commit hooks run.

**If commit fails due to pre-commit hook:**
→ Fix the issues raised by the hook
→ Return to step 3 (local verification)
→ Re-run verification loop

### 5. Push to Remote

```bash
git push origin {branch}
```

**If push fails:**
- Check if branch is protected
- Check for force push requirements
- Ask user for help if needed

**Display:**
```
✅ Pushed to origin/{branch}
Waiting for CI to pick up changes...
```

### 6. Confirm Loop Back

**If `{auto_mode}` = true:**
→ Automatically proceed to step-01 to watch CI

**If `{auto_mode}` = false:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Continue"
    question: "Fixes pushed. Watch CI for results?"
    options:
      - label: "Watch CI (Recommended)"
        description: "Monitor the new CI run"
      - label: "Stop here"
        description: "I'll check CI manually"
    multiSelect: false
```

---

## SUCCESS METRICS:

✅ Changes staged correctly
✅ Commit created with descriptive message
✅ Pre-commit hooks passed (no --no-verify)
✅ Changes pushed to remote
✅ Ready to loop back to step-01

## FAILURE MODES:

❌ **CRITICAL**: Committing without local_verified = true
❌ **CRITICAL**: Using --no-verify flag
❌ Vague commit messages like "fix" or "update"
❌ Not pushing after commit
❌ Not looping back to watch CI

## COMMIT PROTOCOLS:

- Commit message must describe what was fixed
- Include attempt number for tracking
- Never bypass pre-commit hooks
- Always push immediately after commit

---

## NEXT STEP:

**After push completes:**
Loop back to `./step-01-watch-ci.md`

The loop continues until:
1. CI passes (success!) - workflow ends
2. Max attempts reached - ask user for help
3. User cancels

<critical>
Remember: This creates a loop! After push, we go back to watching CI. The workflow only ends when CI is green or max attempts reached.
</critical>
