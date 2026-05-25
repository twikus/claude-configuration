---
name: total-cleanup
description: Complete code cleanup workflow - security review, clean code analysis, and code simplification in sequence. Run after generating code.
argument-hint: "[-a] [-s] [files or feature]"
---

<objective>
Perform a complete code cleanup in 3 phases: security check, clean code analysis, and code simplification.
</objective>

<quick_start>
**Basic usage (cleanup generated code):**
```bash
/total-cleanup src/features/auth
```

**Auto mode (skip confirmations):**
```bash
/total-cleanup -a
```

**With save (output to `.claude/output/total-cleanup/`):**
```bash
/total-cleanup -s src/api
```

**What it does:**
1. **Security Check** - Uses code-reviewer agent to find vulnerabilities
2. **Clean Code** - Runs /clean-code skill for best practices
3. **Simplify** - Uses code-simplifier agent to reduce complexity
</quick_start>

<parameters>

| Flag | Description |
|------|-------------|
| `-a` | Auto mode: skip confirmations between steps |
| `-s` | Save mode: output reports to `.claude/output/total-cleanup/` |
| `-1` | Security only: run only security check |
| `-2` | Clean code only: run only clean code check |
| `-3` | Simplify only: run only code simplification |

<examples>
```bash
/total-cleanup                     # Cleanup recently modified code
/total-cleanup -a src/             # Auto mode on src folder
/total-cleanup -s auth feature     # Save reports
/total-cleanup -1 src/api          # Security check only
```
</examples>

</parameters>

<workflow>
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Step 1     │───►│   Step 2     │───►│   Step 3     │
│  Security    │    │  Clean Code  │    │  Simplify    │
│  (reviewer)  │    │  (skill)     │    │  (agent)     │
└──────────────┘    └──────────────┘    └──────────────┘
```
</workflow>

<state_variables>

| Variable | Type | Description |
|----------|------|-------------|
| `{target_files}` | array | Files/folders to analyze |
| `{auto_mode}` | boolean | Skip confirmations |
| `{save_mode}` | boolean | Save reports to output folder |
| `{only_step}` | number | If set, run only this step (1, 2, or 3) |
| `{security_findings}` | array | Issues from security check |
| `{clean_code_issues}` | array | Issues from clean code check |
| `{output_dir}` | string | `.claude/output/total-cleanup/{task_id}` |

</state_variables>

<agents_used>

| Step | Agent/Skill | Model | Purpose |
|------|-------------|-------|---------|
| 1 | `code-reviewer` agent | Haiku | Security vulnerability detection |
| 2 | `clean-code-runner` agent | **Opus** | Clean code best practices (runs /clean-code skill) |
| 3 | `code-simplifier` agent | Haiku | Code simplification and clarity |

</agents_used>

<entry_point>

Load `steps/step-00-init.md`

</entry_point>

<step_files>

| Step | File | Purpose |
|------|------|---------|
| 00 | `step-00-init.md` | Parse flags, detect files |
| 01 | `step-01-security.md` | Security check with code-reviewer |
| 02 | `step-02-clean-code.md` | Clean code with /clean-code skill |
| 03 | `step-03-simplify.md` | Simplify with code-simplifier agent |

</step_files>

<success_criteria>
- All target files identified
- Security vulnerabilities found and fixed
- Clean code principles applied
- Code simplified without changing functionality
- Each step completes fully before next
- Reports saved (if save_mode)
</success_criteria>
