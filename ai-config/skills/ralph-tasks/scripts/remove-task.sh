#!/bin/bash
# Remove a task from the Ralph Tasks queue
# Usage: ./remove-task.sh <project-path> <task-id>

set -e

PROJECT_PATH="${1:-.}"
TASK_ID="$2"

if [ -z "$TASK_ID" ]; then
  echo "❌ Error: Task ID required"
  echo "Usage: ./remove-task.sh <project-path> <task-id>"
  exit 1
fi

# Validate task ID is a number
if ! [[ "$TASK_ID" =~ ^[0-9]+$ ]]; then
  echo "❌ Error: Task ID must be a number"
  exit 1
fi

# Resolve absolute path
PROJECT_PATH=$(cd "$PROJECT_PATH" && pwd)
TASKS_FILE="$PROJECT_PATH/.claude/ralph-tasks/tasks.json"

if [ ! -f "$TASKS_FILE" ]; then
  echo "❌ Error: tasks.json not found at $TASKS_FILE"
  echo "Run /ralph-tasks setup first"
  exit 1
fi

# Check if task exists
TASK_EXISTS=$(jq --argjson id "$TASK_ID" '[.tasks[] | select(.id == $id)] | length' "$TASKS_FILE")

if [ "$TASK_EXISTS" -eq 0 ]; then
  echo "❌ Error: Task #$TASK_ID not found"
  exit 1
fi

# Get task description for confirmation
TASK_DESC=$(jq -r --argjson id "$TASK_ID" '.tasks[] | select(.id == $id) | .description' "$TASKS_FILE")

# Remove task using jq
jq --argjson id "$TASK_ID" '.tasks = [.tasks[] | select(.id != $id)]' \
  "$TASKS_FILE" > "$TASKS_FILE.tmp" && mv "$TASKS_FILE.tmp" "$TASKS_FILE"

echo "✅ Task #$TASK_ID removed: $TASK_DESC"
