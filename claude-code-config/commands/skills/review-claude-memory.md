---
description: Review CLAUDE.md quality against best practices with 9-dimension scoring and actionable recommendations
allowed-tools: Skill(claude-memory), Read, Glob, Grep, Bash(find *), Task
---

<objective>
Audit CLAUDE.md files using the claude-memory skill's best practices. Score across 9 quality dimensions and provide actionable improvements.
</objective>

<process>
1. Invoke the claude-memory skill to load best practices
2. Locate all CLAUDE.md files using Glob
3. Analyze each file against the 9 dimensions below
4. Verify documented information matches codebase reality
5. Generate scores and recommendations
</process>

<scoring_dimensions>
Evaluate each dimension (0-10):

| Dimension | What to Check |
|-----------|---------------|
| **Specificity** | Concrete vs vague instructions |
| **Redundancy** | Repeated information (lower = better) |
| **Relevance** | Current vs deprecated content |
| **Completeness** | Essential sections present (commands, conventions, workflow) |
| **Emphasis** | CRITICAL/NEVER/ALWAYS keywords for important rules |
| **Structure** | Clear headings, logical organization |
| **Actionability** | Immediately executable instructions |
| **Efficiency** | Under 200 lines, max value per token |
| **Accuracy** | Documented paths/commands actually exist |
</scoring_dimensions>

<verification_checklist>
- [ ] Commands in package.json match documented commands
- [ ] File paths mentioned actually exist
- [ ] Libraries referenced are installed
- [ ] @import paths point to real files
- [ ] Code patterns mentioned exist in codebase
</verification_checklist>

<output_format>
```markdown
## CLAUDE.md Quality Analysis

### Files Analyzed
- [path/to/CLAUDE.md] (X lines)

### Quality Scores

| Dimension | Score | Issues |
|-----------|-------|--------|
| Specificity | X/10 | [issue or "None"] |
| Redundancy | X/10 | [issue or "None"] |
| Relevance | X/10 | [issue or "None"] |
| Completeness | X/10 | [issue or "None"] |
| Emphasis | X/10 | [issue or "None"] |
| Structure | X/10 | [issue or "None"] |
| Actionability | X/10 | [issue or "None"] |
| Efficiency | X/10 | [issue or "None"] |
| Accuracy | X/10 | [issue or "None"] |

**Overall Score: X.X/10** (XX%)

### Verification Results
- Commands: X/Y verified
- Paths: X/Y exist
- Libraries: X/Y installed

### Top Recommendations
1. **[Action]**: [Specific change] - Impact: +X in [dimension]
2. **[Action]**: [Specific change] - Impact: +X in [dimension]
3. **[Action]**: [Specific change] - Impact: +X in [dimension]
```
</output_format>

<scoring_guide>
- **9.0-10.0**: Excellent - minimal improvements
- **7.5-8.9**: Good - some optimization opportunities
- **6.0-7.4**: Fair - needs improvement
- **Below 6.0**: Poor - significant revision required
</scoring_guide>

<rules>
- BE OBJECTIVE: Base scores on observable criteria
- BE SPECIFIC: Quote exact examples from the file
- BE CONSTRUCTIVE: Focus on actionable improvements
- NO EMOJI: Clean, professional output only
</rules>
