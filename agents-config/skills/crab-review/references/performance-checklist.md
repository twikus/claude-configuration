# Performance Review Checklist

## Profiler Lens

Identify CPU-heavy operations and unnecessary computation.

**Rendering performance (frontend):**
- Unnecessary re-renders (missing memo, useMemo, useCallback)
- Large component trees re-rendering on unrelated state changes
- Expensive computations inside render cycle (move to useMemo)
- Layout thrashing (read-write-read DOM patterns)
- Synchronous heavy work blocking the main thread

**Algorithm complexity:**
- O(n^2) or worse where O(n) or O(n log n) is possible
- Nested loops over large datasets
- Repeated work that could be cached/memoized
- String concatenation in loops (use array.join)
- Sorting done multiple times on same data

**Bundle/load performance:**
- Large imports that could be code-split or lazy-loaded
- Importing entire libraries for one function (e.g., full lodash)
- Synchronous imports of heavy modules at startup
- Missing dynamic import() for route-level splitting

**Unnecessary work:**
- API calls made on every render instead of once
- Recalculating derived data instead of caching
- Polling when websockets or SSE would work
- Fetching data that's already available in state/context

## Query Analyzer Lens

Evaluate database and API query efficiency.

**N+1 queries:**
- Loop that makes one query per item (use batch/join instead)
- GraphQL resolvers that trigger separate DB calls per field
- ORM lazy-loading in loops (use eager loading/include)

**Over-fetching:**
- SELECT * when only specific columns needed
- Fetching full objects when only IDs needed
- API responses returning nested data that's never used
- Pagination missing on unbounded queries

**Missing optimization:**
- Queries without appropriate indexes (WHERE/ORDER BY columns)
- Missing database-level filtering (filtering in application code)
- Sequential queries that could be parallelized (Promise.all)
- Missing query result caching for expensive/repeated queries

**Connection management:**
- Connection pool exhaustion risk
- Missing connection timeouts
- Connections not returned to pool on error
- Too many concurrent connections to same service

## Memory Inspector Lens

Hunt for memory leaks and excessive memory usage.

**Event listener leaks:**
- addEventListener without corresponding removeEventListener
- Missing cleanup in useEffect return function
- WebSocket/SSE connections not closed on unmount
- setInterval/setTimeout not cleared

**Closure leaks:**
- Large objects captured in closures that outlive their usefulness
- Callbacks holding references to removed DOM elements
- Event handlers keeping entire component scope alive

**Unbounded growth:**
- Caches without size limits or eviction
- Arrays/maps that grow without bounds
- History/undo stacks without maximum length
- Log buffers that never flush

**Large allocations:**
- Loading entire file into memory (use streaming)
- Creating large temporary arrays/objects in hot paths
- Deep cloning large objects when shallow would suffice
- Base64 encoding large binary data in memory
