---
description: Add minimal, intelligent JSDoc comments to help LLMs understand how to use a file
argument-hint: <file-path> [additional-files...]
---

<objective>
Add minimal but effective JSDoc comments to #$ARGUMENTS to help LLMs understand how to use the exported functions, classes, or utilities.

The goal is NOT to over-document, but to provide:
- Clear descriptions of what each export does
- When/why to use each export (use cases)
- Practical code examples showing real usage
- Parameter and return type explanations when not obvious
</objective>

<style_guide>
Follow this commenting style (minimal but informative):

**For utility wrappers (single main export):**
```ts
/**
 * Short title describing the utility
 *
 * @description
 * Detailed explanation of:
 * - What it does and what it wraps
 * - Key features and benefits
 * - How it differs from the underlying API
 *
 * @example
 * // Basic usage
 * const result = await utility("/api/endpoint");
 *
 * @example
 * // Advanced usage with options
 * const result = await utility("/api/endpoint", {
 *   option: value,
 * });
 *
 * @param input - Description of first param
 * @param options - Description of options object
 * @returns Description of return value
 *
 * @throws {ErrorType} When this happens
 */
export const utility = ...
```

**For multiple related exports (action clients, hooks, etc.):**
```ts
/**
 * Export name - Short description
 *
 * @description
 * - Key behavior 1
 * - Key behavior 2
 * - What it provides in context
 *
 * Use this for [specific use case].
 *
 * @example
 * ```ts
 * export const myAction = actionClient
 *   .inputSchema(z.object({ ... }))
 *   .action(async ({ parsedInput, ctx }) => {
 *     // Show realistic usage
 *     return { result: true };
 *   });
 * ```
 */
export const actionClient = ...
```
</style_guide>

<rules>
1. **Minimal comments** - Only add what helps understanding, avoid redundant info
2. **Focus on "when to use"** - The most valuable info for LLMs is knowing WHEN to pick this export
3. **Real examples** - Examples should be realistic and show actual patterns
4. **No obvious comments** - Don't document what the code already makes clear
5. **Preserve existing code** - Only ADD comments, never modify the actual code
6. **Match file style** - If file uses certain patterns, mirror them in examples
</rules>

<process>
1. **Read the target file**: Analyze #$ARGUMENTS to identify all exports (functions, classes, constants, types)

2. **Explore the codebase for real usage**: For each export, search the codebase to find:
   - Where it's imported and used
   - Common patterns and configurations
   - Edge cases and variations in usage
   - What parameters are typically passed

   Use grep/glob to find imports like `from "./path/to/file"` or `from "@/path/to/file"`

3. **Analyze usage patterns**: From the real usages found, extract:
   - The most common use case (for primary @example)
   - Variations and advanced patterns (for secondary @example if valuable)
   - Actual parameter values and configurations used
   - Context about WHY it's used in each place

4. **Write JSDoc comments** based on real discoveries:
   - @description explains what it does + when to use it
   - @example blocks use REAL code patterns found in the codebase (simplified/anonymized if needed)
   - Parameters documented based on actual usage patterns

5. **Keep it minimal**: Only document what adds value - if usage is obvious from the code, skip it
</process>

<success_criteria>
- Codebase explored to find real usages of each export
- Every major export has a JSDoc comment with @description
- @example blocks based on ACTUAL usage patterns found in the codebase
- Comments explain WHEN to use each export based on real use cases discovered
- No over-documentation - comments are concise and useful
- Original code unchanged except for added comments
</success_criteria>
