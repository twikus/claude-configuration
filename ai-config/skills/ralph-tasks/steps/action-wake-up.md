---
name: action-wake-up
description: Show instructions to start the Ralph loop
---

# Action: Wake Up

Show the user how to start the Ralph autonomous loop.

## AVAILABLE STATE:

| Variable | Value |
|----------|-------|
| `{project_path}` | Current project path |
| `{tasks_dir}` | Path to .claude/ralph-tasks/ |

## PRE-CHECK:

Verify {tasks_dir}/wake-up.sh exists. If not:
```
❌ Ralph Tasks not initialized.
Run: /ralph-tasks setup
```

## EXECUTION SEQUENCE:

### 1. Show Instructions

```
🤖 Start Ralph Loop

Run this command in a terminal:

  sh {tasks_dir}/wake-up.sh

What happens:
• Processes tasks one by one (lowest ID first)
• Marks task as in_progress → implements → marks completed
• Commits changes after each task
• Waits 60 seconds when no pending tasks
• Continues indefinitely until Ctrl+C

To stop: Press Ctrl+C

Tips:
• Run in a separate terminal window
• Add tasks anytime with: /ralph-tasks add "task"
• Monitor progress with: /ralph-tasks list
```

## CRITICAL RULE:

🛑 NEVER run wake-up.sh automatically
🛑 NEVER execute `sh {tasks_dir}/wake-up.sh` for the user

The user MUST copy and run the command themselves.

## SUCCESS CRITERIA:

✅ Clear instructions displayed
✅ Command shown for user to copy
✅ wake-up.sh NOT executed automatically
