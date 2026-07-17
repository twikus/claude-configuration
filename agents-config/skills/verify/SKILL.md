---
name: verify
description: Prove that a feature, fix, application, workflow, API, or CLI actually works through current runtime evidence. Use when the user asks to verify, prove, demonstrate, confirm, test end to end, browser-test, capture screenshots, validate a fix in the real app, or refuses an unproven completion claim.
---

# Verify

## Objective

Your objective is now to prove that it works.

Do not answer the weaker question “Does it probably work?” Prove the requested behavior through the real user surface and produce enough current evidence for another person to independently follow the flow and reach the same conclusion.

Verification is a completion gate, not a final commentary step.

## Non-Negotiable Rules

- Do not claim success from code inspection, typecheck, lint, tests, mocks, or confidence alone.
- Exercise the real feature in the intended runtime through the same surface a user uses.
- Capture a screenshot for every observable visual step of the flow, not only the final screen.
- Give every non-visual step durable raw evidence: command, exit code, response, log, trace, file, or state read-back. Capture the terminal too when the harness supports it.
- Map every acceptance criterion to one or more evidence-backed flow steps.
- Inspect relevant console errors, page errors, failed requests, crashes, and logs.
- Treat missing, stale, ambiguous, or contradictory evidence as `NOT PROVEN`.
- Never offer to skip verification, accept the current state, or finish without re-verifying.
- Invalidate and replace affected evidence after every code, configuration, data, or environment change.
- Continue diagnosing, fixing, and re-verifying until the proof gate is PASS.

If the user explicitly restricts the task to read-only verification, respect that boundary: do not fix failures. Keep the verdict `NOT PROVEN`, exhaust safe read-only evidence paths, and report the exact blocker instead of pretending the feature works.

## Define the Claim

Extract the claim to prove from the user request and current task context. Write measurable acceptance criteria before interacting with the app.

Identify:

- the target feature or fix;
- the intended environment and real user surface;
- the starting state and required account, role, fixture, or data;
- the happy path;
- relevant validation, error, permission, persistence, refresh, relaunch, and regression behavior;
- the observable result that would prove each criterion.

When the request refers to work just completed, use the original request and actual diff as context. Do not silently narrow the claim to the easiest part to demonstrate.

## Load Project Rules

Before launching or touching the runtime, read verification instructions in this order:

1. `.agents/rules/` files about verification, QA, browser, simulator, testing, or E2E
2. `AGENTS.md`
3. `CLAUDE.md`
4. `README.md`, package scripts, test configuration, and launch configuration

Follow the project-approved browser, simulator, auth, seed, and launch workflow. Check whether the app is already reachable before starting, restarting, or stopping a service.

## Build a Proof Matrix

Create the matrix before executing the flow:

| ID | Acceptance criterion | Starting state | Real action | Expected observable result | Required evidence | Status |
|---|---|---|---|---|---|---|
| F01 | AC1 | ... | ... | ... | Screenshot | NOT PROVEN |

Include a separate row for:

- reaching the correct initial surface;
- each user action, route transition, submitted request, or meaningful state change;
- each intermediate state needed to understand that the flow is progressing correctly;
- the final successful result;
- every relevant negative, permission, persistence, refresh, relaunch, or regression path implied by the claim.

Do not merge multiple observable steps to reduce the number of captures. Every visual row requires its own screenshot.

## Exercise the Real Flow

For every matrix row, in order:

1. Establish the documented starting state.
2. Perform the real action through the real surface.
3. Wait for the expected result; a click, request submission, or navigation attempt is not proof of its outcome.
4. Inspect the resulting UI or output plus relevant errors, network failures, crashes, and logs.
5. Capture the evidence immediately.
6. Record the environment, route or command, action, observed result, timestamp, and absolute artifact path.
7. Mark PASS only when the evidence visibly or mechanically demonstrates the expected result.

Use ordered artifact names such as:

```text
F01-initial-state.png
F02-action-result.png
F03-final-success.png
```

### Visual apps

- Capture the initial screen and every observable step after each action.
- Keep the relevant state visible; avoid crops that remove the context needed to understand the proof.
- Record the exact URL, app route, device, simulator, or build.
- Include every screenshot inline in the final response using its absolute local path.
- Check responsive or native variants only when they are part of the claim, affected scope, or acceptance criteria.

### CLI tools

- Run the exact command a user would run.
- Preserve stdout, stderr, and exit code.
- Verify the resulting filesystem or remote state when the command claims a side effect.
- Capture the terminal at each meaningful step when possible.

### APIs and background behavior

- Preserve the exact request and response.
- Verify authentication, status, body, and the resulting durable state.
- Read back the state from the authoritative surface rather than trusting an accepted or queued response.
- Capture associated logs or terminal output and any user-visible consequence.

## Evaluate the Proof Gate

Set the proof gate to PASS only when this expression is true:

```text
every acceptance criterion is covered
AND every proof-matrix row is PASS
AND every required artifact exists and is current
AND no observed error invalidates the claim
```

Anything else is `NOT PROVEN`.

## Continue Until Proven

While the proof gate is not PASS:

1. Identify the exact failing behavior or missing evidence.
2. Find the root cause with the shortest real feedback loop.
3. Apply the smallest in-scope fix, unless the task is explicitly read-only.
4. Run relevant static checks and automated tests.
5. Reset or relaunch into a clean verification state.
6. Re-run every affected flow step.
7. Replace every invalidated artifact.
8. Re-evaluate the complete matrix, not only the previously failing row.

There is no retry limit. Difficulty, elapsed time, or repeated failed attempts are not completion conditions.

If progress depends on genuinely unavailable access, credentials, hardware, external approval, or a third-party state, exhaust safe alternatives. Do not claim success and do not close the objective. Report `BLOCKED — NOT PROVEN`, include the exact blocker and attempted paths, and request the precise action needed to resume. Only an explicit user cancellation can end the objective without proof.

## Report the Proof

Lead with the verdict, then provide the evidence in flow order:

```markdown
## Proof of Functionality

**Claim:** ...
**Environment:** ...

| Step | AC | Action | Observed result | Evidence | Status |
|---|---|---|---|---|---|
| F01 | AC1 | ... | ... | `F01-initial-state.png` | PASS |

### Evidence Gallery

![F01 - Initial state](/absolute/path/F01-initial-state.png)
![F02 - Action result](/absolute/path/F02-action-result.png)

### Runtime Checks

- Console/page errors: none
- Failed requests: none relevant
- Persistence/read-back: PASS

**Proof Gate:** PASS
```

A path list without inline images is not a complete visual proof. A PASS without the proof matrix and current artifacts is invalid.

## Completion Condition

Stop only when one of these conditions is true:

1. `PASS`: every acceptance criterion and flow step is proven with current evidence.
2. The user explicitly cancels the verification objective.

An external blocker is not completion. Keep the objective open as `BLOCKED — NOT PROVEN` and state exactly what is needed to continue.
