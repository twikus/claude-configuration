---
name: action-setup
description: Initialize ralph-tasks in the current project
---

# Action: Setup

Initialize the ralph-tasks infrastructure in the current project.

## AVAILABLE STATE:

| Variable | Value |
|----------|-------|
| `{project_path}` | Current project path |
| `{tasks_dir}` | Path to .claude/ralph-tasks/ |

## EXECUTION SEQUENCE:

### 1. Run Setup Script

```bash
bash ~/.claude/skills/ralph-tasks/scripts/setup.sh "{project_path}"
```

### 2. Show Success Message

```
✅ Ralph Tasks initialized!

Created: {tasks_dir}/
├── tasks.json       # Task queue (empty)
├── wake-up.sh       # Main loop script
├── prompt.md        # Agent instructions
└── progress.txt     # Learnings log

Next steps:
1. Add tasks: /ralph-tasks add "your task description"
2. List tasks: /ralph-tasks list
3. Start loop: sh {tasks_dir}/wake-up.sh
```

## SUCCESS CRITERIA:

✅ Directory created at {tasks_dir}
✅ All files created (tasks.json, wake-up.sh, prompt.md, progress.txt)
✅ Success message displayed
