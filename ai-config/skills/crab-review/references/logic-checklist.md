# Logic Review Checklist

## Edge Cases Lens

Hunt for inputs and scenarios that break the code.

**Null/undefined:**
- What happens with null input? undefined? empty string?
- Optional chaining used where needed?
- Default values sensible? (0, empty array, null - which is correct?)
- Database queries returning null handled?

**Boundaries:**
- Off-by-one errors in loops, slices, pagination?
- Integer overflow on large values?
- Empty arrays/collections handled? (`.length === 0`)
- Single-element arrays handled? (`.at(0)` vs `.at(-1)`)
- Maximum limits: what if count is 0? What if it's 1,000,000?

**Type coercion:**
- `==` vs `===` used correctly?
- String/number conversions explicit?
- Boolean coercion of 0, "", null, undefined, NaN considered?
- JSON.parse failures handled?

**Concurrency:**
- Race conditions in async operations?
- State mutations between await points?
- Parallel operations that should be sequential?
- Double-submit protection?

**Unicode/i18n:**
- String length vs character count for Unicode?
- Locale-sensitive sorting/comparison?
- RTL text considerations?

## Correctness Lens

Verify the code does exactly what it claims.

**Contract verification:**
- Does the function return type match all code paths?
- Are all branches of if/switch handled? (missing else/default?)
- Do loops terminate? Is the termination condition correct?
- Are async operations properly awaited?

**State management:**
- Is state initialized before use?
- Are state transitions valid? (can you reach an impossible state?)
- Is shared state modified safely?
- Are closures capturing the right values? (stale closure problem)

**Algorithm correctness:**
- Does the sort comparator handle all cases? (a < b, a > b, a === b)
- Are filter/map/reduce operations correct?
- Are regular expressions tested with edge inputs?
- Is the time complexity acceptable for expected data sizes?

**API contracts:**
- Do HTTP methods match intent? (GET for reads, POST for mutations)
- Are response shapes consistent?
- Are error codes meaningful and documented?
- Are required fields actually required? Optional fields actually optional?

**Data integrity:**
- Are database transactions used for multi-step operations?
- Are optimistic updates rolled back on failure?
- Are partial failures handled? (3 of 5 items saved - now what?)
- Is data validated before persistence?

## Resilience Lens

Evaluate how the code behaves when things go wrong.

**Error handling:**
- Are errors caught at the right level? (not too broad, not too narrow)
- Are caught errors actually handled? (no empty catch blocks)
- Do error messages help debugging? (context: what was attempted, what failed)
- Are errors logged with enough context to reproduce?
- Is there a difference between expected errors (validation) and unexpected errors (crashes)?

**External dependencies:**
- What happens when the API call fails? Times out?
- Is there retry logic? With backoff?
- What if the response shape is different than expected?
- Are timeouts set on all external calls?

**Graceful degradation:**
- Can the feature work in a degraded mode?
- Are fallback values sensible?
- Does a failure in one part cascade to others unnecessarily?
- Are circuit breakers needed for flaky dependencies?

**Recovery:**
- After a crash, can the system resume correctly?
- Is idempotency ensured for retryable operations?
- Are cleanup operations (finally blocks, dispose) properly implemented?
- Are resources (connections, file handles, listeners) properly released?
