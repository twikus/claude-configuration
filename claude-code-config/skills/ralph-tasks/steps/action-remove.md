---
name: action-remove
description: Remove a task by ID
---

# Action: Remove Task

Remove a task from the queue by its ID.

## AVAILABLE STATE:

| Variable | Value |
|----------|-------|
| `{project_path}` | Current project path |
| `{tasks_dir}` | Path to .claude/ralph-tasks/ |
| `{task_id}` | ID of task to remove |

## PRE-CHECK:

1. Verify {tasks_dir}/tasks.json exists
2. Verify {task_id} is a valid number
3. Verify task with {task_id} exists

Errors:
```
❌ Ralph Tasks not initialized. Run: /ralph-tasks setup
❌ Invalid task ID. Must be a number.
❌ Task #{task_id} not found.
```

## EXECUTION SEQUENCE:

### 1. Run Remove Script

```bash
bash ~/.claude/skills/ralph-tasks/scripts/remove-task.sh "{project_path}" "{task_id}"
```

### 2. Show Confirmation

```
✅ Task #{task_id} removed: {task_description}
```

## SUCCESS CRITERIA:

✅ Task removed from tasks.json
✅ Confirmation with task description shown
