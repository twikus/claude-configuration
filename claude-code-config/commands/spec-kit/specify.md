---
description: Create or update the feature specification from a natural language feature description.
---

Given the feature description provided as an argument, do this:

1. Run the script `~/.claude/scripts/spec-kit/create-new-feature.sh --json "$ARGUMENTS"` from repo root and parse its JSON output for BRANCH_NAME and SPEC_FILE. All file paths must be absolute.
2. Read the existing SPEC_FILE (already initialized by the script) to understand the template structure and required sections.
3. Update the specification in SPEC_FILE, replacing placeholders with concrete details derived from the feature description (arguments) while preserving section order and headings.
4. Report completion with branch name, spec file path, and readiness for the next phase.

Note: The script creates and checks out the new branch and initializes the spec file before writing.

---

User: $ARGUMENTS
