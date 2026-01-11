---
description: Audit Prisma queries to ensure minimal data selection with select over include
allowed-tools: Task, Read, Grep, Glob, Write
---

You are a database optimization specialist with expertise in Prisma ORM and query performance. Audit all Prisma queries to ensure minimal data fetching.

**You need to ULTRA THINK before launching agents.**

## Workflow

1. **EXPLORE**: Find all Prisma queries across codebase

   - Launch **parallel explore-codebase agents** to search for:
     - All files with `prisma` imports or usage
     - All occurrences of `.findMany()`, `.findUnique()`, `.findFirst()`
     - All database query patterns in actions, routes, and utilities
   - **CRITICAL**: Search across multiple areas:
     - Server actions (`*.action.ts`)
     - API routes (`*/route.ts`)
     - Utility functions (`src/lib/**`)
     - Feature modules (`src/features/**`)
   - Use `Grep` to find specific patterns: `include:`, `select:`
   - Return comprehensive list of files with Prisma queries

2. **ANALYZE**: Deep dive into each query

   - **For each file found**:
     - `Read` the complete file to understand context
     - Identify all Prisma query operations
     - Check if using `include` vs `select`
     - Map which fields are actually used in the code
   - **CRITICAL CHECKS**:
     - Does query use `include` when `select` would be better?
     - Are all selected/included fields actually used?
     - Could nested relations use `select` to limit data?
     - Are there N+1 query patterns that need attention?
   - **THINK DEEPLY**: Understand data flow from query to usage

3. **CLASSIFY**: Categorize findings

   - **HIGH PRIORITY**: Queries using `include` that fetch unused data
     - Large relation includes without field selection
     - Deeply nested includes
     - Queries in frequently-called functions
   - **MEDIUM PRIORITY**: Queries using `select` but selecting too much
     - Selecting fields never used in code
     - Could be more specific with nested selects
   - **LOW PRIORITY**: Already optimized queries
     - Using `select` with minimal fields
     - Only fetching what's needed
   - **CRITICAL**: Focus on queries that impact performance most

4. **DOCUMENT**: Create optimization report

   - `Write` report to `.claude/analysis/prisma-query-optimization.md`
   - Include concrete examples with file references
   - Show before/after for each optimization
   - Prioritize by performance impact
   - **NON-NEGOTIABLE**: Use exact format below

## Optimization Report Format

```markdown
# Prisma Query Optimization Report

**Generated**: {date}
**Total Queries Analyzed**: {count}
**Optimization Opportunities**: {count}

## Executive Summary

- **HIGH Priority**: {count} queries with significant optimization potential
- **MEDIUM Priority**: {count} queries with moderate improvements possible
- **LOW Priority**: {count} queries already optimized
- **Estimated Impact**: {description of performance improvement}

## High Priority Optimizations

### 1. {File Path}:{Line Number}

**Current Query**:
\```typescript
// Example: src/features/user/user.action.ts:45
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    organizations: true,
    sessions: true,
    emailCampaigns: true
  }
})
\```

**Issue**: Includes all fields from 3 relations, but only uses `organizations.name` and `sessions.createdAt`

**Optimized Query**:
\```typescript
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true,
    organizations: {
      select: {
        id: true,
        name: true
      }
    },
    sessions: {
      select: {
        createdAt: true
      }
    }
    // emailCampaigns removed - not used
  }
})
\```

**Impact**: Reduces data transfer by ~70%, eliminates unused relation fetch

---

### 2. {Next Optimization}

[Same structure]

## Medium Priority Optimizations

[Similar structure for medium priority items]

## Low Priority / Already Optimized

- ✅ `src/auth/session.ts:23` - Using select with minimal fields
- ✅ `src/features/email/send.action.ts:67` - Optimized nested selects

## Optimization Patterns Found

### Pattern 1: Include → Select with Nested Relations
**Occurrences**: {count} files
**Example Files**:
- `file1.ts:line`
- `file2.ts:line`

### Pattern 2: Over-fetching Unused Fields
**Occurrences**: {count} files
**Common unused fields**: `createdAt`, `updatedAt`, etc.

## Recommendations

1. **Immediate Actions** (High Priority):
   - Update queries in: {list files}
   - Expected performance gain: {percentage}

2. **Code Standards**:
   - **ALWAYS prefer `select` over `include`**
   - Only include fields that are actually used
   - Use nested `select` for relations
   - Avoid `include: true` - be explicit

3. **Development Guidelines**:
   - Before writing Prisma query, identify exact fields needed
   - Review query performance in frequently-called functions
   - Use Prisma's `.$queryRaw` for complex optimizations if needed

## Implementation Checklist

- [ ] Review and apply all HIGH priority optimizations
- [ ] Test each change to ensure functionality unchanged
- [ ] Update type definitions if needed
- [ ] Run performance tests to validate improvements
- [ ] Document query patterns in CLAUDE.md

## Code References

{Complete list of files analyzed with line numbers}
```

## Execution Rules

- **PARALLEL EXPLORATION**: Launch multiple agents simultaneously to search different areas
- **DEEP ANALYSIS**: Don't just find queries - understand data usage
- **EVIDENCE-BASED**: Every optimization backed by code analysis
- **CONCRETE EXAMPLES**: Show exact before/after code
- **PRIORITIZE IMPACT**: Focus on queries that matter for performance
- **NEVER**: Suggest optimizations without verifying field usage

## Analysis Depth

For each query, verify:
1. **What fields are selected/included?**
2. **Which fields are actually used in the code?**
3. **Are there nested relations that could be optimized?**
4. **How frequently is this query called?**
5. **What's the potential performance impact?**

## Priority

Thoroughness > Speed. Deliver actionable optimizations with measurable impact.
