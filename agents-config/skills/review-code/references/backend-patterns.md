<overview>
Backend code review checklist covering API design, database patterns, error handling, concurrency, and infrastructure concerns.
</overview>

<api_design priority="critical">
**REST/GraphQL hygiene:**

- [ ] Proper HTTP status codes (not 200 for everything)
- [ ] Input validation at API boundary (zod, joi, class-validator)
- [ ] Rate limiting on public endpoints
- [ ] Pagination for list endpoints (cursor or offset)
- [ ] Consistent error response format
- [ ] No sensitive data in URLs (tokens, passwords in query params)
- [ ] CORS configured correctly (not `*` in production)
- [ ] Request size limits set
</api_design>

<database priority="critical">
**Data layer:**

- [ ] Transactions for multi-step operations
- [ ] Indexes on frequently queried columns
- [ ] N+1 query prevention (eager loading, joins, dataloaders)
- [ ] Connection pooling configured
- [ ] Migrations are reversible
- [ ] No raw SQL with user input (use ORM or parameterized queries)
- [ ] Soft delete considered for important data
- [ ] Proper cascade behavior on foreign keys
</database>

<error_handling priority="high">
**Resilience:**

- [ ] Errors caught at appropriate level (not too broad, not too narrow)
- [ ] External service calls have timeouts
- [ ] Retry logic with exponential backoff for transient failures
- [ ] Circuit breaker for unreliable dependencies
- [ ] Graceful degradation (fallback behavior)
- [ ] Error logging includes context (request ID, user, action)
- [ ] No stack traces exposed to clients
</error_handling>

<concurrency priority="high">
**Race conditions and data integrity:**

- [ ] Optimistic locking for concurrent updates
- [ ] Idempotent operations (safe to retry)
- [ ] Queue-based processing for long operations
- [ ] Atomic operations where needed
- [ ] No shared mutable state without synchronization
</concurrency>

<authentication_authorization priority="critical">
**Auth patterns:**

- [ ] JWT expiry set appropriately (short-lived access, long-lived refresh)
- [ ] Token refresh flow implemented
- [ ] Session invalidation on password change
- [ ] Role-based access control (RBAC) enforced server-side
- [ ] API key rotation strategy
- [ ] No auth bypass on internal endpoints
</authentication_authorization>

<observability priority="medium">
**Production readiness:**

- [ ] Structured logging (JSON, not plain text)
- [ ] Request IDs for tracing
- [ ] Health check endpoints
- [ ] Metrics for critical paths (latency, error rate)
- [ ] Alertable error categories
</observability>

<search_patterns>
Grep patterns for backend issues:

<n_plus_one>
```bash
grep -rE '(findOne|findById|get)\s*\(' --include="*.{ts,js}" -l
```
Cross-reference with loop patterns to detect N+1.
</n_plus_one>

<missing_error_handling>
```bash
grep -rE '(await|\.then)\s*\(' --include="*.{ts,js}" -l
```
Check that async calls have try/catch or .catch.
</missing_error_handling>

<exposed_secrets>
```bash
grep -rE '(process\.env\.|env\.)\w+' --include="*.{ts,js}" -l
```
Verify env vars aren't logged or exposed.
</exposed_secrets>
</search_patterns>

<sources>
- [12 Factor App](https://12factor.net/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [OWASP API Security Top 10](https://owasp.org/API-Security/)
</sources>
