---
name: step-01b-log-instrumentation
description: Add strategic logs and collect user feedback for visibility
prev_step: steps/step-01-analyze.md
next_step: steps/step-02-find-solutions.md
reference: references/log-technique.md
---

# Step 1b: Log Instrumentation Technique

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER propose solutions in this step
- ✅ ALWAYS add logs with proper prefixes `[DEBUG:xxx]`
- 📋 YOU ARE AN INSTRUMENTER, adding visibility to the code
- 💬 FOCUS on gathering runtime information only
- 🚫 FORBIDDEN to fix the bug or change logic
- 🔒 NEVER log sensitive data (passwords, tokens, PII)

## EXECUTION PROTOCOLS:

- 🎯 Show your log placement strategy before adding logs
- 💾 Track all added logs in `{debug_logs}` for later removal
- 📖 Wait for user to run and share logs before proceeding
- 🚫 FORBIDDEN to proceed without log output from user

## CONTEXT BOUNDARIES:

- Variables from step-01: `{error_context}`, `{auto_mode}`, `{error_analysis}`
- This step is OPTIONAL - only triggered when reproduction fails
- Load [references/log-technique.md](../references/log-technique.md) for patterns

## YOUR TASK:

Add strategic debug logs to the suspected code area and ask the user to run the application and share the log output for analysis.

---

## When This Step Is Triggered

This step is used when:
- ❌ Cannot reproduce the error directly
- 🌐 Bug only occurs in user's environment
- ⏱️ Intermittent/timing-sensitive issue
- 🔍 Need visibility into actual runtime behavior

---

## EXECUTION SEQUENCE:

### 1. Identify Log Placement Areas

Based on `{error_analysis}`, identify where to add logs:

**Suspected Code Areas:**

| Area | File | Lines | Why Log Here |
|------|------|-------|--------------|
| Entry point | {file} | {lines} | *To confirm function is called* |
| Decision point | {file} | {lines} | *To see which branch is taken* |
| Data transformation | {file} | {lines} | *To see actual values* |
| Exit point | {file} | {lines} | *To see final result* |

### 2. Add Debug Logs

<critical>
Use the [Log Technique Reference](../references/log-technique.md) for proper formatting!
</critical>

**Log Prefix Convention:**
- `[DEBUG:entry]` - Function entry
- `[DEBUG:exit]` - Function exit
- `[DEBUG:decision]` - Conditional checks
- `[DEBUG:branch]` - Branch taken
- `[DEBUG:transform]` - Data changes
- `[DEBUG:async]` - Async operations
- `[DEBUG:state]` - State snapshots
- `[DEBUG:error]` - Caught errors

**For each log added, track it:**

| # | File | Line | Prefix | Purpose |
|---|------|------|--------|---------|
| 1 | {path} | {line} | `[DEBUG:entry]` | *What you're checking* |
| 2 | {path} | {line} | `[DEBUG:decision]` | *What condition* |
| 3 | ... | ... | ... | ... |

**Example Implementation:**

```javascript
// At function entry
console.log('[DEBUG:entry] processOrder', {
  timestamp: new Date().toISOString(),
  orderId: order.id,
  itemCount: order.items.length
});

// At decision point
console.log('[DEBUG:decision] validateOrder', {
  isValid: order.items.length > 0,
  hasPayment: !!order.paymentMethod
});

// At async boundary
console.log('[DEBUG:async:start] fetchInventory', { time: Date.now() });
const inventory = await fetchInventory(order.items);
console.log('[DEBUG:async:end] fetchInventory', {
  time: Date.now(),
  found: inventory.length
});
```

### 3. Security Check

<critical>
Before asking user to run, verify NO sensitive data is logged!
</critical>

**Checklist:**
- [ ] No passwords or tokens
- [ ] No API keys or secrets
- [ ] No personal identifiable information (PII)
- [ ] No credit card numbers
- [ ] No session IDs

**If sensitive data needed, sanitize:**
```javascript
// BAD
console.log('[DEBUG]', { password });

// GOOD
console.log('[DEBUG]', {
  passwordProvided: !!password,
  passwordLength: password?.length
});
```

### 4. Ask User to Run and Share Logs

**If `{auto_mode}` = true:**
→ Skip this step entirely - cannot use log technique in auto mode
→ Proceed to step-02 with best available analysis

**If `{auto_mode}` = false:**

Present summary of added logs, then use **AskUserQuestion**:

```yaml
questions:
  - header: "Run App"
    question: "I've added {N} debug logs to track the issue. Please run the application, reproduce the error, and paste the console output back here. Ready?"
    options:
      - label: "I'll run it now (Recommended)"
        description: "I'll execute the app and share the logs"
      - label: "Logs aren't in right place"
        description: "I think the problem is elsewhere"
      - label: "Can't run it now"
        description: "I'll do this later or skip"
    multiSelect: false
```

**Handle responses:**
- **"I'll run it now":** Wait for user to paste logs, then proceed to Analysis
- **"Logs aren't in right place":** Ask where they think the issue is, add logs there
- **"Can't run it now":** Proceed to step-02 with current analysis

### 5. Analyze Returned Logs

When user shares logs:

**Parse the output:**
1. Look for all `[DEBUG:xxx]` lines
2. Check execution order (timestamps if present)
3. Identify unexpected values or missing logs
4. Note which branches were taken

**Log Analysis:**

| Log | Expected | Actual | Insight |
|-----|----------|--------|---------|
| `[DEBUG:entry] func` | Called once | Called 3x | *Unexpected multiple calls* |
| `[DEBUG:decision] check` | `true` | `false` | *Condition failing* |
| `[DEBUG:async:end]` | Present | Missing | *Promise never resolved* |

**Update `{error_analysis}` with findings:**
- What the logs revealed
- Root cause (if now clear)
- Any remaining unknowns

### 6. Decide Next Action

**Use AskUserQuestion:**

```yaml
questions:
  - header: "Analysis"
    question: "Based on the logs, I found: [summary]. What would you like to do?"
    options:
      - label: "Proceed to fix (Recommended)"
        description: "The root cause is clear, let's find solutions"
      - label: "Add more logs"
        description: "Need deeper visibility in another area"
      - label: "Different area"
        description: "The problem seems to be elsewhere"
    multiSelect: false
```

**Handle responses:**
- **"Proceed to fix":** Update `{error_analysis}`, go to step-02
- **"Add more logs":** Return to step 2, add more targeted logs
- **"Different area":** Update suspected area, return to step 2

### 7. Track Logs for Cleanup

**Store in `{debug_logs}` for later removal:**

```yaml
debug_logs:
  - file: "src/api.ts"
    line: 45
    prefix: "[DEBUG:entry]"
  - file: "src/api.ts"
    line: 52
    prefix: "[DEBUG:exit]"
  - file: "src/utils.ts"
    line: 23
    prefix: "[DEBUG:transform]"
```

<critical>
These logs MUST be removed in step-04-fix or step-05-verify!
</critical>

---

## SUCCESS METRICS:

✅ Strategic logs added at key checkpoints
✅ All added logs tracked in `{debug_logs}`
✅ No sensitive data in logs
✅ User ran app and shared log output
✅ Log output analyzed for insights
✅ `{error_analysis}` updated with findings
✅ Root cause clearer than before

## FAILURE MODES:

❌ Adding logs without a clear strategy
❌ Logging sensitive data (passwords, tokens, PII)
❌ Not tracking logs for later removal
❌ Proceeding without user log output (unless auto mode)
❌ **CRITICAL**: Making code fixes in this step
❌ **CRITICAL**: Not asking user to run and share logs

## STATE UPDATES:

After this step, ensure:
- `{error_analysis}` includes log findings
- `{debug_logs}` lists all added logs for cleanup
- Decision recorded on whether to iterate or proceed

---

## NEXT STEP:

After log analysis complete, load `./step-02-find-solutions.md`

<critical>
Remember: This step is about VISIBILITY - don't fix anything yet!
All debug logs MUST be removed later - track them carefully!
</critical>
