---
name: step-06-resolve
description: Resolve findings - interactively address review issues
prev_step: steps/step-05-review.md
next_step: COMPLETE
---

# Step 6: Resolve Findings

**Goal:** Address adversarial review findings interactively. Fix real issues, dismiss noise, discuss uncertain items.

---

<available_state>
From previous steps:

- `{task_description}` - What was implemented
- `{auto_mode}` - If true, use auto-fix for Real findings
- Findings table with IDs, severity, validity
- Finding todos for tracking
</available_state>

---

<execution_sequence>

<present_options>
**1. Present Resolution Options**

**If `{auto_mode}` = true:**
→ Automatically use Option 2 (Auto-fix) - fix all "Real" findings without asking.

**If `{auto_mode}` = false:**
```
**How would you like to handle these findings?**

**[1] Walk through** - Discuss each finding individually (recommended for complex issues)
**[2] Auto-fix (Recommended)** - Automatically fix issues classified as "Real"
**[3] Skip** - Acknowledge findings and proceed without changes

Choose option: (1/2/3)
```
</present_options>

<option_1>
**OPTION 1: Walk Through**

For each finding in severity order:

**1.1 Present Finding**
```
**Finding F1** [Critical | Security | Real]
**Location:** `src/auth/handler.ts:42`

**Issue:** SQL injection vulnerability. User input concatenated into query.

**Code:**
const result = db.query("SELECT * FROM users WHERE id=" + userId);

**Suggested fix:** Use parameterized query

**Action?**
- **[f] Fix now** - Apply the suggested fix
- **[s] Skip** - Acknowledge and move on
- **[d] Discuss** - Need more context
```

**1.2 Handle Response**

**If Fix:**
1. Apply the fix immediately
2. Verify fix doesn't break anything
3. Mark finding as resolved
4. Move to next finding

**If Skip:**
1. Note finding was acknowledged but not fixed
2. Record reason if provided
3. Move to next finding

**If Discuss:**
1. Provide more context about the issue
2. Explain potential impact
3. Re-ask for action

**1.3 Track Progress**

Update todos as findings are resolved:
```
1. ✓ F1 [Critical/Real] Fixed SQL injection in auth.ts:42
2. ⏳ F2 [High/Real] Add null check in handler.ts:78
3. ⏸ F3 [Medium/Uncertain] Discuss: Simplify utils.ts:15
```

**1.4 Summary After Walkthrough**
```
**Walkthrough Complete**

**Resolved:** 3 findings fixed
**Skipped:** 1 finding (F4 - agreed it's noise)
**Discussed:** 1 finding (F3 - decided not applicable)

All critical and high severity issues addressed.
```
</option_1>

<option_2>
**OPTION 2: Auto-fix**

**2.1 Filter to Real Findings**

Only process findings classified as "Real":
- Skip: Noise, Uncertain
- Fix: Real

**2.2 Apply Fixes**

For each Real finding:
1. Read the affected file
2. Apply suggested fix
3. Verify change is valid
4. Mark as resolved

**2.3 Report Results**
```
**Auto-fix Applied**

**Fixed:**
- F1: Parameterized SQL query in auth.ts:42
- F2: Added null check in handler.ts:78

**Skipped (noise/uncertain):**
- F3: Complex function in utils.ts (uncertain)
- F4: Style in config.ts (noise)

**Verification:**
- Typecheck: ✓
- Lint: ✓
```
</option_2>

<option_3>
**OPTION 3: Skip**

**3.1 Acknowledge**
```
**Findings Acknowledged**

All {count} findings have been reviewed.
User chose to proceed without applying fixes.

**Note:** The following issues remain:
- F1 [Critical]: SQL injection in auth.ts:42
- F2 [High]: Missing null check in handler.ts:78
```

**3.2 Confirm Proceed**
```
Are you sure you want to proceed with unresolved Critical/High findings? (y/n)
```
</option_3>

<post_resolution>
**Post-Resolution Validation**

After any fixes applied:
```bash
pnpm run typecheck && pnpm run lint
```
Both must pass before completion.
</post_resolution>

</execution_sequence>

---

<completion_summary>
**Final Completion Summary**

```
**APEX Workflow Complete**

**Task:** {task_description}

**Implementation:**
- Files modified: {count}
- Tests added: {count}
- All checks passing: ✓

**Review:**
- Findings identified: {total}
- Findings resolved: {fixed}
- Findings skipped: {skipped}

**Files Changed:**
- `src/auth/handler.ts` - Token validation, SQL fix
- `src/api/routes.ts` - Route integration
- `src/auth/handler.test.ts` - Test coverage

**Next Steps:**
- [ ] Commit changes: `git add -A && git commit -m "feat: {description}"`
- [ ] Run full test suite if desired
- [ ] Deploy when ready
```
</completion_summary>

---

<success_metrics>

- User chose resolution approach (or auto-fix if `{auto_mode}`)
- All chosen fixes applied correctly
- Validation passes after fixes
- Clear summary of what was resolved/skipped
- User understands next steps
</success_metrics>

<failure_modes>

- Not presenting resolution options
- Auto-fixing "noise" or "uncertain" findings
- Not validating after fixes
- No clear completion summary
- Leaving user unclear on state
</failure_modes>

---

<workflow_complete>
**APEX Skills Workflow Complete**

The workflow has finished. User can:
- Commit changes
- Run additional tests
- Deploy to staging/production
- Start new APEX workflow for next task
</workflow_complete>
