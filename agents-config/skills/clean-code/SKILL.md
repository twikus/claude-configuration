---
name: clean-code
description: Clean Code rules for TypeScript, React, and Next.js. Apply when writing, refactoring, or reviewing code - naming, small functions, no any, early returns, typed errors, plus tech-specific rules for React 19, Next.js 15/16, Zustand v5, TanStack Query v5.
argument-hint: "[feature/file]"
---

# Clean Code Rules

Follow these rules as much as possible whenever you write, refactor, or review code. They are guidelines, not a workflow: apply them inline, in every edit. When a rule conflicts with the existing codebase style, match the codebase and mention the tension.

If a target (feature, file, directory) is given as argument, read that code and bring it in line with these rules, then verify with the project's build/lint/test commands.

## Core rules

### Naming

- Names reveal intent: `currentDate`, not `d`; `doubleValue(value)`, not `fn(x)`.
- Booleans read as predicates: `isLoading`, `hasAccess`, `canEdit`.
- Functions are verbs (`fetchUser`), values are nouns (`userProfile`).
- No abbreviations except universally known ones (`id`, `url`, `api`).

### Functions & components

- Single responsibility: one thing per function/component. If describing it needs "and", split it.
- Functions < 20 lines, components < 150 lines as a soft ceiling.
- Early returns over nested `if`/`else`; max ~2 levels of nesting.
- Prefer pure functions; push side effects to the edges.
- Extract complex conditions into named booleans or predicates.

### DRY & simplicity

- Rule of 3: abstract on the third repetition, not the first.
- KISS: readable beats clever. Prefer the boring solution.
- Delete dead code and commented-out code; git remembers.
- No magic numbers/strings: use named constants.

### TypeScript

- Never `any`: use `unknown` + narrowing, generics, or discriminated unions.
- `satisfies` to validate without widening; `as const satisfies` for literal maps.
- Discriminated unions for state (`{ status: 'loading' } | { status: 'success'; data: T } | ...`) with exhaustive `switch` (`never` check in `default`).
- Utility types over hand-rolled shapes: `Partial` for patches, `Pick`/`Omit` for DTOs, `Record` for dictionaries.
- Branded types when mixing primitives is dangerous (`UserId` vs `ProductId`).
- Derive types from values (`ReturnType`, `typeof`, schema inference) rather than duplicating them.

### Error handling

- Typed error classes (`AppError` with `code`/`statusCode`) or a `Result<T, E>` type; never swallow errors silently.
- Fail fast: validate inputs at the boundary, throw/return early.
- No `console.log` left in committed code; use the project's logger.

### Control flow & data

- Immutability by default: `const`, spread/`toSorted`/`toReversed` over mutation.
- Prefer `map`/`filter`/`reduce` chains when they stay readable; a plain loop when they don't.
- Handle the error/empty/loading cases first, happy path last and unindented.

### File organization

- One component per file; feature-based folders (`features/auth/{components,hooks,utils}`).
- Import order: external → internal absolute (`@/`) → relative → `import type` last.
- Colocate tests next to the code they test.

## Tech-specific rules

When the code you're touching uses one of these, load the matching reference and follow it:

| Reference | Load when touching |
|-----------|-------------------|
| [references/general-clean-code.md](references/general-clean-code.md) | Full TypeScript detail: branded types, template literal types, `Result`, tsconfig strictness |
| [references/react-clean-code.md](references/react-clean-code.md) | React components/hooks: React 19 (`use`, `useActionState`, `useOptimistic`, ref-as-prop, no manual memo), Suspense, error boundaries |
| [references/nextjs-clean-code.md](references/nextjs-clean-code.md) | Next.js App Router: Server Components, Server Actions, caching, async params (15+) |
| [references/zustand-best-practices.md](references/zustand-best-practices.md) | Zustand stores: v5 syntax, slices, selectors, middleware |
| [references/tanstack-query-best-practices.md](references/tanstack-query-best-practices.md) | Data fetching: query key factories, `useSuspenseQuery`, mutations, invalidation — and any `useEffect`-based fetching to migrate |

## Anti-patterns — always fix on sight

| Anti-pattern | Fix |
|--------------|-----|
| `any` | `unknown`, generics, discriminated unions |
| `useEffect` for data fetching | TanStack Query (or Server Components) |
| `useState` for server data | TanStack Query |
| Props drilling 3+ levels | Composition, Zustand, or Context |
| Manual `useMemo`/`useCallback`/`memo` everywhere | React Compiler (React 19) — remove unless measured |
| `forwardRef` | ref as prop (React 19) |
| Deep nesting | Early returns |
| Magic numbers | Named constants |
| Commented-out code | Delete it |

## Verification

After applying rules to existing code, run the project's typecheck/build and tests (and lint if configured). Never leave the codebase in a broken state to satisfy a style rule.
