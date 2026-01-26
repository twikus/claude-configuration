---
name: action-add
description: Add a task to the queue (without search)
---

# Action: Add Task

Add a single task to the task queue.

## AVAILABLE STATE:

| Variable | Value |
|----------|-------|
| `{project_path}` | Current project path |
| `{tasks_dir}` | Path to .claude/ralph-tasks/ |
| `{task_description}` | Task description from user |

## PRE-CHECK:

Verify {tasks_dir}/tasks.json exists. If not:
```
❌ Ralph Tasks not initialized.
Run: /ralph-tasks setup
```

## EXECUTION SEQUENCE:

### 1. Run Add Script

```bash
bash ~/.claude/skills/ralph-tasks/scripts/add-task.sh "{project_path}" "{task_description}"
```

### 2. Show Confirmation

```
✅ Task #{new_id} added: {task_description}

View tasks: /ralph-tasks list
```

## SUCCESS CRITERIA:

✅ Task added to tasks.json with new ID
✅ Status set to "pending"
✅ Confirmation message displayed
