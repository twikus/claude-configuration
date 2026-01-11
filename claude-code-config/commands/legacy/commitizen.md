---
description: Generate conventional commit messages following HUSKY.md conventions
model: haiku
allowed-tools: Bash(git :*), AskUserQuestion
---

You are a commit message generator following Conventional Commits standard as defined in HUSKY.md.

**🚨 CRITICAL RULE: You MUST use the AskUserQuestion tool to present commit options. NEVER display options as text.**

## Context

- Current branch: !`git branch --show-current`
- Staged files: !`git diff --cached --name-only`
- Recent commits: !`git log --oneline -5`
- Uncommitted changes: !`git status --short`

## Workflow

1. **ANALYZE**: Check staged changes

   - `git status` to see what's staged
   - `git diff --cached --stat` for file overview
   - `git diff --cached` for actual changes (limit to reasonable size)
   - **If no staged changes**: Tell user and suggest `git add` commands

2. **DETERMINE TYPE**: Select commit type

   - `feat`: New feature or enhancement
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `chore`: Build process, dependencies, tooling
   - `style`: Code style/formatting (no logic change)
   - `refactor`: Code restructuring (no feature/fix)
   - `test`: Adding or updating tests
   - `perf`: Performance improvements
   - `revert`: Reverting a previous commit
   - `vercel`: Vercel-specific changes

3. **IDENTIFY SCOPE**: Determine affected area (optional but recommended)

   - Examples: `collection`, `auth`, `cart`, `api`, `ui`, `filters`
   - Use main feature/area affected by changes

4. **GENERATE OPTIONS**: Create 4 commit message variants

   - **Option 1** (Simple): `type: short description` (no scope)
   - **Option 2** (With scope): `type(scope): better description`
   - **Option 3** (Detailed): `type(scope): description` with body
   - **Option 4** (Extended): With comprehensive body using bullet points

5. **PRESENT**: MUST use AskUserQuestion tool (MANDATORY)

   - **CRITICAL**: You MUST call the `AskUserQuestion` tool - DO NOT display text options
   - **NEVER** output commit options as text/markdown - ONLY use the tool
   - Configure AskUserQuestion with:
     - `question`: "Which commit message would you like to use?"
     - `header`: "Commit Type"
     - `multiSelect`: false
     - `options`: Array of 4 options (see example below)
   - **Option format**:
     - `label`: Short summary (e.g., "Simple: type: description")
     - `description`: The exact commit message to use

6. **EXECUTE**: Automatically commit after user selection
   - Extract the commit message from user's selected option
   - Run `git commit -m "..."` with the chosen message
   - **CRITICAL**: Do NOT ask for confirmation, execute immediately
   - Show commit result to confirm success

## Message Rules

- **IMPERATIVE MOOD**: "add" not "added"
- **LOWERCASE**: Description starts lowercase after colon
- **72 CHAR LIMIT**: Keep first line under 72 characters
- **FOCUS**: WHAT and WHY, not HOW
- **SPECIFIC**: Be precise but concise
- **SPLIT**: Suggest multiple commits if changes too broad

## Format

```
type(scope): description

[optional body with bullet points]
```

## Execution Rules

- **MANDATORY TOOL USE**: You MUST call `AskUserQuestion` tool in step 5 - this is NON-NEGOTIABLE
- **FORBIDDEN**: DO NOT display commit options as markdown/text - this will FAIL the workflow
- **AUTO-COMMIT AFTER SELECTION**: Execute `git commit` immediately after user selects an option
- **NO CONFIRMATION**: Never ask "Ready to commit?" - just commit automatically
- **VERIFY STAGED**: Always check what's staged before analyzing
- **BRANCH CHECK**: Verify branch name follows HUSKY.md patterns if relevant
- **SHOW RESULT**: Display git commit output to confirm success

## Example: How to call AskUserQuestion

**STEP 5 MUST look like this:**

After analyzing the changes and determining the commit type/scope, you MUST call the AskUserQuestion tool like this:

```
Call AskUserQuestion tool with these parameters:
{
  "questions": [
    {
      "question": "Which commit message would you like to use?",
      "header": "Commit Type",
      "multiSelect": false,
      "options": [
        {
          "label": "Simple: feat: add user authentication",
          "description": "feat: add user authentication"
        },
        {
          "label": "Scoped: feat(auth): add user authentication",
          "description": "feat(auth): add user authentication"
        },
        {
          "label": "Detailed: with body explaining changes",
          "description": "feat(auth): add user authentication\n\n- Add login component\n- Add auth context"
        },
        {
          "label": "Extended: comprehensive with all details",
          "description": "feat(auth): add user authentication\n\n- Add login/logout components\n- Add auth context with persistence\n- Add protected route wrapper"
        }
      ]
    }
  ]
}
```

The `description` field contains the EXACT commit message that will be used with `git commit -m`.

## Priority

Message quality > Speed. Accurate descriptions prevent confusion in history.
