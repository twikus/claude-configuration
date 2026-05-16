# Security Review Checklist

## Attacker Lens

Think like a threat actor trying to exploit this code.

**Injection surfaces:**
- User input passed to SQL/shell/eval without sanitization
- Template literals with user data (template injection)
- URL parameters used in redirects (open redirect)
- File paths constructed from user input (path traversal)
- Deserialization of untrusted data

**Authentication bypass:**
- Missing auth checks on endpoints
- JWT not validated (signature, expiry, audience)
- Session fixation possible
- Password reset flows leaking tokens
- Timing attacks on comparisons (use constant-time compare)

**Authorization gaps:**
- IDOR: Can user A access user B's resources by changing IDs?
- Missing ownership checks on CRUD operations
- Role checks done client-side only
- Privilege escalation via parameter manipulation
- GraphQL introspection exposing internal schema

**Exposure:**
- Secrets in source (API keys, passwords, tokens)
- Stack traces or internal errors returned to client
- Verbose error messages revealing system info
- Debug endpoints left enabled
- CORS set to `*` on authenticated endpoints

## Auditor Lens

Systematically verify security controls against OWASP Top 10.

**A01 - Broken Access Control:**
- Server-side enforcement on every request
- Default deny policy
- Rate limiting on sensitive endpoints
- CORS configured per-origin (not wildcard)

**A02 - Cryptographic Failures:**
- TLS for all data in transit
- Passwords: bcrypt/argon2/scrypt (never MD5/SHA1/SHA256)
- Encryption keys not hardcoded
- Sensitive data not stored unnecessarily
- No custom crypto implementations

**A03 - Injection:**
- Parameterized queries for SQL
- Input validation (allowlist, not blocklist)
- Output encoding for HTML context
- Command injection: no `exec`, `system`, `eval` with user input

**A04 - Insecure Design:**
- Business logic abuse scenarios considered
- Rate limiting on resource-intensive operations
- Proper error handling (no fail-open)

**A05 - Security Misconfiguration:**
- Security headers set (CSP, X-Frame-Options, HSTS)
- Default credentials removed
- Unnecessary features disabled
- Dependencies up to date

**A07 - Authentication Failures:**
- Brute force protection (lockout/delay)
- MFA on sensitive operations
- Session invalidation on logout/password change
- Secure cookie flags (HttpOnly, Secure, SameSite)

**A08 - Data Integrity:**
- CI/CD pipeline integrity
- Dependency verification
- No unsigned/unverified updates

## Data Flow Lens

Trace sensitive data through the code.

**Sensitive data types to track:**
- Credentials (passwords, API keys, tokens)
- PII (email, name, phone, address, IP)
- Financial data (card numbers, bank accounts)
- Session/auth tokens

**Check at each stage:**
- **Input**: Is it validated and sanitized?
- **Processing**: Is it encrypted/hashed appropriately?
- **Storage**: Is it encrypted at rest? Access-controlled?
- **Output**: Is it masked/redacted before logging or display?
- **Transit**: Is it transmitted over TLS?
- **Deletion**: Can it be properly purged?

**Logging audit:**
- NEVER log: passwords, tokens, full card numbers, raw PII
- ALWAYS log: auth events, access denials, admin actions
- Log entries should include: timestamp, user ID, action, result

**Data leaks:**
- API responses returning more fields than needed
- Error messages containing sensitive data
- Cache/temp files containing unencrypted sensitive data
- Browser localStorage/sessionStorage with tokens (prefer httpOnly cookies)
