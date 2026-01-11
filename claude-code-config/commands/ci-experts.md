---
description: Debug CI/CD with Vercel CLI and GitHub CLI - fetch logs, artifacts, and troubleshoot failures
argument-hint: <action> (e.g., "debug vercel", "download artifacts", "investigate failure")
allowed-tools: Skill(ci-experts), Bash, Read, Write
---

<objective>
Delegate CI/CD debugging to the ci-experts skill for: #$ARGUMENTS

This routes to specialized skill containing Vercel CLI, GitHub CLI commands, and troubleshooting workflows.
</objective>

<process>
1. Use Skill tool to invoke ci-experts skill
2. Pass user's request: #$ARGUMENTS
3. Let skill handle the debugging workflow
4. Store all artifacts in /tmp/{project-name}/
</process>

<success_criteria>
- Skill successfully invoked
- Arguments passed correctly to skill
- Artifacts saved to /tmp/{project-name}/
</success_criteria>
