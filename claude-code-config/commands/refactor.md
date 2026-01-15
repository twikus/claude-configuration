---
description: Refactor code by finding files, grouping them, and launching parallel Snipper agents
argument-hint: <search-pattern-or-description>
---

<objective>
Refactor code matching #$ARGUMENTS across the codebase using parallel Snipper agents for maximum speed.

This command finds all relevant files, creates ONE instruction file, then launches Snipper agents in parallel with batches of max 3 files each.
</objective>

<process>

## Phase 1: Discovery

1. **Parse the refactor request**: Understand what #$ARGUMENTS means
   - Could be: method name, component name, pattern, code smell, etc.
   - Identify the search strategy (Grep for code patterns, Glob for file patterns)

2. **Find all affected files**:
   - Use Grep to search for the pattern in the codebase
   - Use Glob if searching by file name patterns
   - Exclude node_modules, .git, dist, build directories
   - List all files that need refactoring

3. **Analyze scope**:
   - Count total files found
   - If more than 15 files, ask user to confirm or narrow scope
   - Show preview of files to refactor

## Phase 2: Create Instructions

4. **Create task folder**:
   - Generate unique ID: `refactor-{timestamp}`
   - Create folder: `.claude/tasks/refactor-{timestamp}/`

5. **Create ONE instruction file**:
   Create `.claude/tasks/refactor-{id}/instructions.md` with precise, adaptive instructions:

   ```markdown
   # Refactor Instructions

   ## Objective
   {Clear description of what to refactor based on #$ARGUMENTS}

   ## What to Change
   {Specific patterns/code to find and modify}

   ## How to Change
   {Step-by-step transformation rules}

   ## Rules
   - Follow existing codebase patterns
   - No unnecessary comments
   - Preserve functionality
   - Only modify what's necessary for this refactor
   ```

   **IMPORTANT**: Make instructions adaptive - they should work for ANY file in the list.

## Phase 3: Group and Execute

6. **Group files into batches**:
   - Maximum 3 files per batch
   - Group by related functionality when possible

7. **Launch Snipper agents in parallel**:
   For EACH batch, use Task tool with subagent_type='Snipper':

   ```
   Using the instructions in .claude/tasks/refactor-{id}/instructions.md, refactor these files:
   - {file_1}
   - {file_2}
   - {file_3}
   ```

   **CRITICAL**: Launch ALL batches in a SINGLE message with multiple Task calls.

8. **Wait for completion**:
   - All Snipper agents run in parallel
   - Collect results from each

## Phase 4: Verification

9. **Validate changes**:
   - Run `pnpm lint` to check for errors
   - Run `pnpm tsc` if TypeScript project
   - Report any failures

10. **Summary report**:
    - List all files modified
    - Show any errors encountered
    - Provide next steps if needed

</process>

<instructions_template>
Create ONE file at `.claude/tasks/refactor-{id}/instructions.md`:

```markdown
# Refactor: {title}

## Objective
{What needs to be refactored - derived from #$ARGUMENTS}

## Pattern to Find
{Exact code pattern, method name, or structure to locate}

## Transformation
{How to transform the found pattern - be specific and adaptive}

## Examples
Before:
```
{example of current code}
```

After:
```
{example of refactored code}
```

## Constraints
- Only modify code matching the pattern
- Preserve all existing functionality
- Follow codebase conventions
- No comments unless necessary
```
</instructions_template>

<snipper_prompt_template>
For each batch, call Snipper with:

```
Using the instructions in .claude/tasks/refactor-{id}/instructions.md, refactor these files:
- {file_path_1}
- {file_path_2}
- {file_path_3}

Read the instructions file first, then apply the refactor to each file.
```
</snipper_prompt_template>

<success_criteria>
- All target files identified
- ONE instruction file created in `.claude/tasks/refactor-{id}/instructions.md`
- Snipper agents launched in parallel (max 3 files per agent)
- All batches completed successfully
- Lint/type checks pass
- Summary provided to user
</success_criteria>

<example>
User: `/refactor rename getUserData to fetchUserProfile`

1. Grep finds 12 files containing "getUserData"
2. Creates `.claude/tasks/refactor-1702489200/`
3. Creates ONE file: `instructions.md` with rename rules
4. Groups into 4 batches of 3 files
5. Launches 4 Snipper agents in parallel, each with:
   "Using instructions in .../instructions.md, refactor: file1, file2, file3"
6. Waits for completion, runs lint
7. Reports: "Refactored 12 files, renamed getUserData to fetchUserProfile"
</example>
