---
name: step-10-verify
description: Prove the feature works through the real user flow with step-by-step evidence
prev_step: steps/step-04-validate.md
next_step: steps/step-09-finish.md
---

# Step 10: Verify (Proof of Functionality)

## Objective

Prove that the feature works. Do not merely decide, infer, or state that it works.

`-v` creates a mandatory proof gate. The workflow cannot finish until current evidence demonstrates that every acceptance criterion and every observable step of the real user flow works.

## Mandatory Rules

- Never replace runtime proof with code inspection, typecheck, lint, unit tests, mocks, or confidence.
- Read and follow the project's verification rules first: `.agents/rules/`, `AGENTS.md`, `CLAUDE.md`, then `README.md` and project scripts.
- Exercise the feature through the same surface a real user uses: browser, native app, CLI, or API client.
- Build the complete flow before testing it. Include setup, each user action or transition, meaningful intermediate states, final outcome, and relevant negative or regression paths.
- Capture a screenshot for every observable visual step. One final screenshot is not sufficient.
- Give every non-visual step an equivalent durable artifact such as raw terminal output, HTTP response, log, trace, or generated file; also capture the terminal when the harness supports it.
- Never reuse stale evidence after a change invalidates it. Re-run and recapture every affected step.
- Never mark PASS while any acceptance criterion, flow step, or required artifact is missing, stale, ambiguous, or failing.
- Never offer “skip verification”, “accept current state”, or “fix without re-verifying”.
- Never proceed to Finish while the proof gate is not PASS.
- If verification exposes a product issue, switch from verifier to implementer, fix it, validate the fix, then restart the affected flow from a clean state.

## Proof Standard

A feature is **proven functional** only when all of the following are true:

1. The real application or service was launched or reached in the intended environment.
2. Every acceptance criterion maps to at least one exercised flow step.
3. Every flow step produced its expected observable result.
4. Every observable visual step has its own current screenshot.
5. Every non-visual step has current raw evidence.
6. Relevant console errors, page errors, failed requests, crashes, and regressions were checked and none invalidate the result.
7. The evidence is organized so another person can follow the flow and independently see that it works.

Tests support this proof, but tests alone never satisfy it.

## Available State

| Variable | Description |
|---|---|
| `{task_description}` | Original user request |
| `{task_id}` | Kebab-case identifier |
| `{acceptance_criteria}` | Success criteria from analysis |
| `{save_mode}` | Save outputs to files |
| `{economy_mode}` | Verify directly without a sub-agent |
| `{output_dir}` | Output path when save mode is enabled |
| Files modified | Implementation produced by Step 3 |

## Execution Sequence

### 1. Start the proof gate

Set `{proof_gate}` to `NOT_PROVEN`.

If `{save_mode}` is true:

```bash
bash {skill_dir}/scripts/update-progress.sh "{task_id}" "10" "verify" "in_progress"
```

Append all proof work to `{output_dir}/10-verify.md`. Do not mark this step complete until `{proof_gate}` is `PASS`.

### 2. Load project verification rules

Inspect in this order:

1. `.agents/rules/` files about verification, testing, QA, browser, simulator, or E2E
2. `AGENTS.md`
3. `CLAUDE.md`
4. `README.md`, package scripts, launch configuration, and test configuration

Record the launch command, target environment, authentication path, seed or fixture requirements, URLs, credentials source, approved browser or simulator, and required evidence.

Do not restart an already-running app unless the project rules or the task require it. Check reachability first.

### 3. Build the proof matrix before interacting

Create a row for every step that must be observed:

| ID | Acceptance criterion | Starting state | User action or request | Expected observable result | Required evidence | Status |
|---|---|---|---|---|---|---|
| F01 | AC1 | ... | ... | ... | Screenshot | NOT PROVEN |

The matrix must include:

- the initial state that proves the correct surface was reached;
- every user action, screen transition, submitted request, or meaningful state change;
- the visible result immediately after each step;
- the final successful outcome;
- relevant validation, failure, permission, refresh, persistence, or regression paths implied by the request.

Do not compress multiple observable steps into one row merely to reduce evidence work.

### 4. Choose the verifier

- If an independent verifier is allowed and useful, give it the original request, acceptance criteria, modified files, project verification rules, and the full proof matrix.
- If sub-agents are unavailable, disallowed, or `{economy_mode}` is true, perform the same protocol directly.

Delegation never transfers responsibility for the proof gate. Inspect every returned artifact yourself before accepting it.

### 5. Exercise and capture the complete flow

For each proof-matrix row, in order:

1. Establish the documented starting state.
2. Perform the real action through the real user surface.
3. Wait for the observable result; do not infer completion from the click or request alone.
4. Check relevant console errors, page errors, failed requests, crashes, and logs.
5. Capture evidence immediately:
   - Visual application: save one screenshot for this row.
   - CLI or API: preserve the raw output or response and capture the terminal when available.
   - Persistent behavior: reload, relaunch, or re-read state, then capture the persisted result.
6. Record the environment, route or command, action, observed result, timestamp, and absolute artifact path.
7. Mark the row PASS only when its expected result is plainly visible in the evidence.

Use ordered artifact names such as `F01-initial-state.png`, `F02-submit.png`, and `F03-success.png`. Include screenshots inline in the final report with absolute local paths.

### 6. Evaluate the proof gate

Set `{proof_gate}` to `PASS` only if:

```text
all acceptance criteria are covered
AND all proof-matrix rows are PASS
AND all required evidence exists and is current
AND no observed error invalidates the flow
```

Otherwise `{proof_gate}` remains `NOT_PROVEN`.

### 7. Continue until proven

While `{proof_gate}` is not `PASS`:

1. Identify the exact missing proof or failing behavior.
2. Diagnose the root cause using the shortest real feedback loop.
3. Apply the necessary in-scope fix.
4. Run relevant static checks and tests.
5. Relaunch or reset to a clean verification state.
6. Re-exercise every affected flow step.
7. Replace invalidated evidence with new captures.
8. Re-evaluate the entire proof matrix.

There is no retry limit. Do not stop because verification is difficult, slow, or has already failed several times.

If a genuine external dependency prevents progress after safe alternatives are exhausted, do not claim completion. Report `BLOCKED — NOT PROVEN`, show the exact blocker and attempts, request the precise access or action needed, and keep the proof objective open. Only an explicit user cancellation can end the objective without proof.

### 8. Present the proof report

```markdown
## Proof of Functionality

**Feature:** {task_description}
**Environment:** {environment and URL/device}

| Step | AC | Action | Observed result | Evidence | Status |
|---|---|---|---|---|---|
| F01 | AC1 | ... | ... | `F01-initial-state.png` | PASS |

### Evidence Gallery

![F01 - Initial state](/absolute/path/F01-initial-state.png)
![F02 - Result after action](/absolute/path/F02-result.png)

### Runtime Checks

- Console/page errors: none
- Failed requests: none relevant
- Persistence/reload: PASS

**Proof Gate:** PASS
```

The gallery must follow the flow order and contain every required screenshot. A list of paths without inline images is incomplete.

### 9. Complete the step only after proof

If `{save_mode}` is true and `{proof_gate}` is `PASS`, append:

```markdown
---
## Step Complete
**Status:** Complete
**Proof Gate:** PASS
**Acceptance Criteria:** all proven
**Flow Steps:** all proven
**Evidence:** complete and current
**Timestamp:** {ISO timestamp}
```

Then run:

```bash
bash {skill_dir}/scripts/update-progress.sh "{task_id}" "10" "verify" "complete"
```

Never write a Step Complete marker for `FAIL`, `BLOCKED`, or `NOT_PROVEN`.

## Success Metrics

- The real feature flow was exercised end to end.
- Every acceptance criterion is linked to runtime evidence.
- Every observable visual step has its own inline screenshot.
- Every non-visual step has durable raw evidence.
- Evidence was refreshed after every affecting fix.
- The final report lets another person independently follow and confirm the flow.
- The proof gate is PASS.

## Failure Modes

- Declaring success from code review, tests, or confidence.
- Capturing only the final screen instead of every observable step.
- Omitting intermediate, negative, persistence, or regression behavior required by the request.
- Reusing screenshots captured before the latest fix.
- Ignoring console errors, failed requests, or crashes.
- Asking to skip, accept, or finish without proof.
- Stopping after an arbitrary number of attempts.
- Marking the workflow complete while blocked or not proven.

## Next Step

Proceed only when `{proof_gate}` is `PASS`:

- If `{pr_mode}` is true, load `./step-09-finish.md`.
- Otherwise, finish the workflow with the full proof report.

If `{proof_gate}` is not `PASS`, remain in this step.
