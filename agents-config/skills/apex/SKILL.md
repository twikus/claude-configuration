---
name: apex
description: Run the configurable APEX one-shot workflow. Use when the user invokes $apex or /apex to analyze, plan, implement, optionally review code, and verify a change.
argument-hint: "[-a] [-v] [-x] <request>"
---

Run the APEX workflow by calling its skills in this order:

1. `$analyze`
2. `$plan`
3. `$implement`
4. `$code-review` only with `-x`
5. `$verify` by default; `-v` explicitly requests the default

Pass each result to the next skill. The `$plan` result is the source of truth. Do not combine or reorder stages.

After `$plan` finishes, continue automatically only when `-a` is present. Without `-a`, stop before `$implement`, present the plan and any issue, and wait for approval.

## Flags

- `-a`: autonomous. Continue into implementation without asking. Resolve facts, make safe reversible decisions, and record assumptions in the plan and, when authorized, on the issue. Stop only for missing authority, access, credentials, or an irreversible material decision.
- `-v`: run `$verify` (already the default).
- `-x`: run `$code-review` after implementation and before verification.

Accept grouped forms such as `-axv`.

If `$code-review` or `$verify` changes the implementation, rerun every affected downstream stage. Close a GitHub issue created in this run only after verification passes every acceptance criterion; otherwise leave it open and report the exact blocker.

Preserve `$verify`'s evidence. Show every verification screenshot with Markdown image syntax and its absolute path.
