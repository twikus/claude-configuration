# Security Code Review Checklist

Based on OWASP Code Review Guide and Top 10 2025.

## Critical Vulnerabilities

### A01: Broken Access Control (Most Critical)
- [ ] Authorization checks on **every request** (not just UI)
- [ ] Server-side enforcement (never trust client)
- [ ] IDOR protection: Users can't access others' data by changing IDs
- [ ] No privilege escalation paths
- [ ] Default deny policy (explicit allow required)

### A02: Security Misconfiguration
- [ ] No default credentials
- [ ] Debug mode disabled in production
- [ ] Secure headers present (CSP, X-Frame-Options, HSTS)
- [ ] Error messages don't expose internals

### A04: Cryptographic Failures
- [ ] TLS 1.2+ for data in transit
- [ ] AES-256 for data at rest
- [ ] Password hashing: bcrypt/Argon2/scrypt (NOT MD5/SHA1)
- [ ] No hardcoded encryption keys

### A05: Injection
- [ ] SQL: Parameterized queries only (no string concatenation)
- [ ] Command: No `eval()`, `exec()`, `system()` with user input
- [ ] XSS: Output encoding context-appropriate
- [ ] Template: No user input in template names

## Input Validation Checklist

```
✓ Server-side validation on ALL inputs
✓ Allowlist approach (whitelist known-good)
✓ Validate: type, length, format, range
✓ File uploads: extension + MIME + content inspection
✓ Regex reviewed for ReDoS vulnerabilities
```

## Authentication Review

| Check | Requirement |
|-------|-------------|
| Password Storage | bcrypt/Argon2 with salt |
| Session Tokens | ≥128 bits entropy, HttpOnly+Secure+SameSite |
| Error Messages | Generic ("Invalid credentials"), no enumeration |
| MFA | Required for sensitive accounts |
| Lockout | Exponential delay after failed attempts |

## Authorization Review

```
✓ Default deny (explicit allow required)
✓ Checks on EVERY request
✓ Server-side only (never trust client roles)
✓ Centralized access control logic
✓ No horizontal escalation (user → other user's data)
✓ No vertical escalation (user → admin functions)
```

## Search Patterns for Vulnerabilities

```bash
# Hardcoded secrets
grep -rE "(password|api[_-]?key|secret|token)\s*=\s*['\"]" --include="*.{js,ts,py,java}"

# Dangerous functions
grep -rE "(eval|exec|system|shell_exec)\s*\(" --include="*.{js,ts,py,php}"

# SQL injection risk
grep -rE "query\s*\(\s*['\"].*\+|execute\s*\(\s*f['\"]" --include="*.{js,ts,py}"
```

## CSRF Protection

```
✓ Tokens in state-changing requests (POST, PUT, DELETE)
✓ Token validated server-side
✓ SameSite=Lax minimum on cookies
✓ GET requests have no side effects
```

## Logging Security

**Must log:**
- Authentication events (login, logout, failed attempts)
- Authorization failures
- Sensitive data access

**Never log:**
- Passwords, API keys, session tokens
- Full credit card numbers
- PII without masking

## Sources
- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)
- [OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
