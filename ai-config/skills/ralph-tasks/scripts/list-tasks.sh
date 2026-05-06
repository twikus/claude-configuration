#!/bin/bash
# List all tasks in the Ralph Tasks queue
# Usage: ./list-tasks.sh <project-path>

set -e

PROJECT_PATH="${1:-.}"

# Resolve absolute path
PROJECT_PATH=$(cd "$PROJECT_PATH" && pwd)
TASKS_FILE="$PROJECT_PATH/.claude/ralph-tasks/tasks.json"

if [ ! -f "$TASKS_FILE" ]; then
  echo "❌ Error: tasks.json not found at $TASKS_FILE"
  echo "Run /ralph-tasks setup first"
  exit 1
fi

# Get counts
PENDING=$(jq '[.tasks[] | select(.status == "pending")] | length' "$TASKS_FILE")
IN_PROGRESS=$(jq '[.tasks[] | select(.status == "in_progress")] | length' "$TASKS_FILE")
COMPLETED=$(jq '[.tasks[] | select(.status == "completed")] | length' "$TASKS_FILE")
TOTAL=$(jq '.tasks | length' "$TASKS_FILE")

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    📋 RALPH TASKS                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$TOTAL" -eq 0 ]; then
  echo "  No tasks found. Add one with:"
  echo "  /ralph-tasks add \"your task description\""
  echo ""
  exit 0
fi

# Print each task
jq -r '.tasks[] | "\(.id)|\(.status)|\(.description)"' "$TASKS_FILE" | while IFS='|' read -r id status desc; do
  case $status in
    "pending")
      icon="⏳"
      ;;
    "in_progress")
      icon="🔄"
      ;;
    "completed")
      icon="✅"
      ;;
    *)
      icon="❓"
      ;;
  esac

  # Truncate description if too long
  if [ ${#desc} -gt 50 ]; then
    desc="${desc:0:47}..."
  fi

  printf "  %s #%-3s %-12s %s\n" "$icon" "$id" "[$status]" "$desc"
done

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "  Summary: $PENDING pending | $IN_PROGRESS in progress | $COMPLETED completed"
echo ""
