#!/usr/bin/env bash
# Replace hardcoded ~/.claude paths with {CLAUDE_PATH} in settings.json
# Run this after syncing settings.json to keep paths portable

set -euo pipefail

SETTINGS="$1"

if [ ! -f "$SETTINGS" ]; then
  echo "Error: settings.json not found at $SETTINGS"
  exit 1
fi

# Replace any absolute path to ~/.claude/ with {CLAUDE_PATH}/
# Handles /Users/<any-user>/.claude/ and /home/<any-user>/.claude/
sed -i '' -E 's|(/Users/[^/]+/\.claude/\|/home/[^/]+/\.claude/)|{CLAUDE_PATH}/|g' "$SETTINGS"

echo "✓ Replaced absolute ~/.claude paths with {CLAUDE_PATH} in $SETTINGS"
