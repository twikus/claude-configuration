---
name: action-list
description: Display all tasks with status
---

# Action: List Tasks

Display all tasks in the queue with their status.

## AVAILABLE STATE:

| Variable | Value |
|----------|-------|
| `{project_path}` | Current project path |
| `{tasks_dir}` | Path to .claude/ralph-tasks/ |

## PRE-CHECK:

Verify {tasks_dir}/tasks.json exists. If not:
```
❌ Ralph Tasks not initialized.
Run: /ralph-tasks setup
```

## EXECUTION SEQUENCE:

### 1. Run List Script

```bash
bash ~/.claude/skills/ralph-tasks/scripts/list-tasks.sh "{project_path}"
```

### 2. Output Format

```
╔════════════════════════════════════════════════════════════╗
║                    📋 RALPH TASKS                          ║
╚════════════════════════════════════════════════════════════╝

  ✅ #1   [completed]   Add user authentication
  🔄 #2   [in_progress] Create dashboard page
  ⏳ #3   [pending]     Add dark mode toggle
  ⏳ #4   [pending]     Implement notifications

─────────────────────────────────────────────────────────────
  Summary: 2 pending | 1 in progress | 1 completed
```

### Status Icons:
- ⏳ `pending` - Not started
- 🔄 `in_progress` - Currently being worked on
- ✅ `completed` - Done

## SUCCESS CRITERIA:

✅ All tasks displayed with ID, status, description
✅ Status icons correctly shown
✅ Summary count displayed
