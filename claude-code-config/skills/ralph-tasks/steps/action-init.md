---
name: action-init
description: Parse command and route to appropriate action file
---

# Action: Initialize & Route

Parse the user's command and route to the appropriate action file.

## EXECUTION SEQUENCE:

### 1. Parse Arguments (Flexible Parsing)

Extract from `$ARGUMENTS`:

**Command detection:**
- `setup` → setup command
- `add` or `add tasks` or `add task` → add command
- `list` or `list tasks` → list command
- `remove` or `remove task` → remove command
- `wake-up` or `wakeup` or `wake up` → wake-up command

**Search flag detection:**
- Look for `--search` or `-s` ANYWHERE in the input
- Remove the flag from the description

**Task description:**
- Everything after the command (minus flags) is the description
- Quotes are OPTIONAL: both `add "task"` and `add task description` work
- Strip leading/trailing whitespace

**Multi-task detection:**
- If the input contains multiple separate task descriptions (user explicitly mentions multiple tasks)
- Process each task separately with parallel Explore agents

### 2. Set State Variables

```
{project_path} = $(pwd)
{tasks_dir} = {project_path}/.claude/ralph-tasks
{command} = parsed command (setup, add, list, remove, wake-up)
{task_description} = parsed description (for add) - can be unquoted
{task_id} = parsed ID (for remove)
{search_mode} = true if --search or -s present
{multi_task} = true if multiple tasks detected
```

### 3. Route to Action File

| Command | Condition | Action File |
|---------|-----------|-------------|
| `setup` | - | Load `steps/action-setup.md` |
| `add` | no -s flag | Load `steps/action-add.md` |
| `add` | with -s/--search | Load `steps/action-add-search.md` |
| `list` | - | Load `steps/action-list.md` |
| `remove` | - | Load `steps/action-remove.md` |
| `wake-up` | - | Load `steps/action-wake-up.md` |
| (unknown) | - | Show help message |

### 4. Help Message (if no command)

```
📋 Ralph Tasks - Manage task queue for autonomous AI

Commands:
  /ralph-tasks setup                    Initialize in current project
  /ralph-tasks add <description>        Add a task (quotes optional)
  /ralph-tasks add <description> -s     Add task with codebase context
  /ralph-tasks list                     List all tasks
  /ralph-tasks remove <id>              Remove task by ID
  /ralph-tasks wake-up                  Show loop start command

Examples:
  /ralph-tasks setup
  /ralph-tasks add Add user authentication
  /ralph-tasks add Fix the login bug -s
  /ralph-tasks add "Add dark mode" --search
  /ralph-tasks list
  /ralph-tasks remove 3
```

## PARSING EXAMPLES:

```
Input: add Fix the login bug
→ command=add, task_description="Fix the login bug", search_mode=false

Input: add tasks -s Make the page load faster
→ command=add, task_description="Make the page load faster", search_mode=true

Input: add "Add authentication" --search
→ command=add, task_description="Add authentication", search_mode=true

Input: add -s please make this work better
→ command=add, task_description="please make this work better", search_mode=true

Input: remove 3
→ command=remove, task_id=3
```

## MULTI-TASK HANDLING:

If user provides multiple tasks in one message (explicitly numbered or separated):
1. Parse each task description
2. For each task with search mode, launch parallel Explore agents
3. Add all tasks sequentially after exploration completes

Example input:
```
add tasks -s fix the login bug
add tasks -s add dark mode
add tasks -s improve performance
```

→ Launch 3 parallel Explore agents, then add 3 tasks.

## SUCCESS CRITERIA:

✅ Command correctly parsed (flexible format accepted)
✅ Description extracted (with or without quotes)
✅ Search flag detected anywhere in input
✅ Multi-task inputs handled
✅ Correct action file loaded
