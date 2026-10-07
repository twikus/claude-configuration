---
name: verify
description: Verify any change, fix, behavior, artifact, workflow, or external state through current evidence from its authoritative surface. Use when the user invokes $verify or asks to verify, prove, check, or demonstrate something.
argument-hint: "<thing to verify or expected outcome>"
---

Prove the explicit `$verify` claim—or, when absent, the latest user request—from current evidence on its real surface. A GitHub issue and a code diff are optional.

1. Define observable pass criteria.
2. Exercise the real user-facing or authoritative surface. Static checks support runtime proof; they do not replace it. For any web page, use only the `dev-browser` CLI.
3. Capture current evidence:
   - Visual: show it on the chat
   - Non-visual: command or request, output, errors, status, and authoritative read-back.
4. Mark each criterion `PASS` or `NOT PROVEN`.

Keep local or static checks, provider read-back, deployed or public artifacts, and authenticated live behavior as distinct proof layers.

After any later change, rerun affected criteria and replace the evidence.

Finish with `PASS` only when every criterion has current evidence. Otherwise `BLOCKED — NOT PROVEN` with the exact blocker.
