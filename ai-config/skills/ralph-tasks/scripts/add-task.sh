#!/bin/bash
# Add a task to the Ralph Tasks queue
# Usage: ./add-task.sh <project-path> "<task description>"

set -e

PROJECT_PATH="${1:-.}"
TASK_DESC="$2"

if [ -z "$TASK_DESC" ]; then
  echo "❌ Error: Task description required"
  echo "Usage: ./add-task.sh <project-path> \"<task description>\""
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

# Add task using jq
DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)

jq --arg desc "$TASK_DESC" --arg date "$DATE" \
  '.lastId += 1 | .tasks += [{"id": .lastId, "description": $desc, "status": "pending", "createdAt": $date}]' \
  "$TASKS_FILE" > "$TASKS_FILE.tmp" && mv "$TASKS_FILE.tmp" "$TASKS_FILE"

# Get the new task ID
NEW_ID=$(jq '.lastId' "$TASKS_FILE")

echo "✅ Task #$NEW_ID added: $TASK_DESC"
