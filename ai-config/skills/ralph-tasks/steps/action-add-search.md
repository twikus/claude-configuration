---
name: action-add-search
description: Add a task with codebase context search
---

# Action: Add Task with Search

Add a task enriched with codebase context for better AI implementation.

## AVAILABLE STATE:

| Variable | Value |
|----------|-------|
| `{project_path}` | Current project path |
| `{tasks_dir}` | Path to .claude/ralph-tasks/ |
| `{task_description}` | Task description (can be multiple) |

## PRE-CHECK:

Verify {tasks_dir}/tasks.json exists. If not:
```
❌ Ralph Tasks not initialized.
Run: /ralph-tasks setup
```

## EXECUTION SEQUENCE:

### 1. Detect Multiple Tasks

If input contains multiple tasks (user explicitly lists several):
- Parse each task separately
- Process ALL tasks in parallel (see step 2)

### 2. Explore Codebase (PARALLEL)

**For EACH task, launch an Explore agent in parallel:**

```
Task tool with subagent_type=Explore:

prompt: "Find context for implementing: {task_description}

Search for:
1. Related files (components, utils, services, routes)
2. Similar existing implementations to reference
3. Patterns and conventions used in codebase
4. Dependencies/imports that might be needed
5. Test patterns if applicable

Return structured summary:
- **Relevant files:** paths with line numbers
- **Patterns:** conventions to follow
- **Dependencies:** libraries/imports
- **Reference:** similar code to look at"
```

**CRITICAL: Launch ALL Explore agents in a SINGLE message for parallel execution.**

### 3. Build Enriched Description

For each task, format:
```
{original task description}

## Context
- **Relevant files:** {discovered files with paths}
- **Patterns to follow:** {patterns found}
- **Dependencies:** {packages/imports needed}
- **Reference:** {similar code paths:line}
```

### 4. Add Tasks

For each enriched task:
```bash
bash ~/.claude/skills/ralph-tasks/scripts/add-task.sh "{project_path}" "{enriched_description}"
```

### 5. Show Summary

```
✅ {N} task(s) added with context:

┌─────┬──────────────────────────────────────┐
│ ID  │ Task                                 │
├─────┼──────────────────────────────────────┤
│ #X  │ {task 1 short description}           │
│ #Y  │ {task 2 short description}           │
└─────┴──────────────────────────────────────┘

Context discovered:
- 📁 Task #X: {N} relevant files
- 📁 Task #Y: {N} relevant files

Run /ralph-tasks list to see all tasks
Run /ralph-tasks wake-up to start the loop
```

## MULTI-TASK EXAMPLE:

Input:
```
add tasks -s fix the login bug
add tasks -s add dark mode toggle
add tasks -s make page load faster
```

Execution:
1. Parse 3 tasks
2. Launch 3 Explore agents IN PARALLEL (single message)
3. Wait for all to complete
4. Add 3 enriched tasks
5. Show summary with all 3

## CONTEXT FORMAT IN TASKS.JSON:

```json
{
  "id": 3,
  "description": "Add dark mode toggle\n\n## Context\n- **Relevant files:** src/components/ThemeProvider.tsx:15-45, src/hooks/useTheme.ts\n- **Patterns to follow:** Uses next-themes, theme in localStorage\n- **Dependencies:** next-themes (installed)\n- **Reference:** ThemeProvider.tsx:15-45 for switching logic",
  "status": "pending",
  "createdAt": "2026-01-22T10:00:00Z"
}
```

## SUCCESS CRITERIA:

✅ All tasks explored in parallel (single message with multiple Task tools)
✅ Context enriched for each task
✅ Tasks added to tasks.json
✅ Clear summary displayed
