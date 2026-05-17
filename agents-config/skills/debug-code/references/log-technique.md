# Log Technique Reference

## Overview

The **Log Technique** is a debugging strategy where you add strategic logging to the codebase and ask the user to run the application and share the logs back. This provides visibility into the application's runtime behavior when:

- The error cannot be reproduced directly by the AI
- The environment is different (production, user's machine, specific setup)
- The bug is intermittent or timing-sensitive
- You need to understand the actual data flow

## When to Use

| Scenario | Use Log Technique? |
|----------|-------------------|
| Cannot reproduce error locally | ✅ Yes |
| Need to see actual runtime data | ✅ Yes |
| Production-only bug | ✅ Yes |
| Intermittent / flaky error | ✅ Yes |
| Clear stack trace with obvious cause | ❌ No |
| Error in code you can run directly | ❌ No |

## Log Placement Strategy

### 1. Entry/Exit Points

Log at the boundaries of the suspected problematic area:

```javascript
// Entry point
console.log('[DEBUG:entry] functionName called', {
  timestamp: new Date().toISOString(),
  args: { param1, param2 }
});

// Exit point
console.log('[DEBUG:exit] functionName completed', {
  timestamp: new Date().toISOString(),
  result: returnValue
});
```

### 2. Decision Points

Log at conditionals where behavior branches:

```javascript
console.log('[DEBUG:decision] checking condition', {
  condition: someValue,
  willTake: someValue > threshold ? 'if-branch' : 'else-branch'
});

if (someValue > threshold) {
  console.log('[DEBUG:branch] took if-branch');
  // ...
} else {
  console.log('[DEBUG:branch] took else-branch');
  // ...
}
```

### 3. Data Transformation Points

Log before and after data changes:

```javascript
console.log('[DEBUG:transform:before] raw data', { data });
const processed = transformData(data);
console.log('[DEBUG:transform:after] processed data', { processed });
```

### 4. Async Boundaries

Log async operations with timing:

```javascript
console.log('[DEBUG:async:start] fetching user', { userId, time: Date.now() });
try {
  const user = await fetchUser(userId);
  console.log('[DEBUG:async:success] user fetched', { user, time: Date.now() });
} catch (error) {
  console.log('[DEBUG:async:error] fetch failed', { error: error.message, time: Date.now() });
}
```

## Log Format Standards

### Prefix Convention

Use consistent prefixes for easy filtering:

| Prefix | Purpose |
|--------|---------|
| `[DEBUG:entry]` | Function/method entry |
| `[DEBUG:exit]` | Function/method exit |
| `[DEBUG:decision]` | Conditional check |
| `[DEBUG:branch]` | Branch taken |
| `[DEBUG:transform]` | Data transformation |
| `[DEBUG:async]` | Async operation |
| `[DEBUG:error]` | Error caught |
| `[DEBUG:state]` | State snapshot |

### Required Information

Each log should include:

1. **What**: Clear description of the checkpoint
2. **Where**: Function/component name
3. **Data**: Relevant values (sanitized if sensitive)
4. **Timing**: Timestamp for async/timing issues

### Example Format

```javascript
console.log('[DEBUG:checkpoint-name] description', {
  function: 'functionName',
  timestamp: new Date().toISOString(),
  data: { /* relevant values */ }
});
```

## Language-Specific Patterns

### JavaScript/TypeScript

```javascript
console.log('[DEBUG:xxx]', JSON.stringify({ ... }, null, 2));
```

### Python

```python
import logging
logging.debug(f'[DEBUG:xxx] {{"key": "{value}"}}')
# or
print(f'[DEBUG:xxx]', {'key': value})
```

### Go

```go
log.Printf("[DEBUG:xxx] %+v\n", data)
```

### Rust

```rust
println!("[DEBUG:xxx] {:?}", data);
// or with tracing
tracing::debug!(?data, "checkpoint description");
```

## Asking for Logs - User Interaction

### AskUserQuestion Pattern

After adding logs, use this pattern:

```yaml
questions:
  - header: "Run & Share"
    question: "I've added debug logs to track the issue. Please run the application, reproduce the error, and paste the console output. Ready?"
    options:
      - label: "I'll run it now"
        description: "I'll execute and share the logs"
      - label: "Need different logs"
        description: "The logs aren't in the right place"
      - label: "Can't run it"
        description: "I can't run the application right now"
    multiSelect: false
```

### Follow-up After Receiving Logs

```yaml
questions:
  - header: "Logs Analysis"
    question: "Based on the logs, I found [X]. Do you want me to add more logs or proceed with the fix?"
    options:
      - label: "Proceed with fix (Recommended)"
        description: "I have enough information"
      - label: "Add more logs"
        description: "I need deeper visibility"
      - label: "Different area"
        description: "The problem is elsewhere"
    multiSelect: false
```

## Log Cleanup

<critical>
ALWAYS remove debug logs after the issue is resolved!
</critical>

### Tracking Logs for Removal

Keep a list of added logs:

| File | Line | Log Prefix |
|------|------|------------|
| src/api.ts | 45 | `[DEBUG:entry]` |
| src/api.ts | 52 | `[DEBUG:exit]` |
| src/utils.ts | 23 | `[DEBUG:transform]` |

### Removal Process

1. Search for `[DEBUG:` pattern in modified files
2. Remove each log statement
3. Verify no debug logs remain: `grep -r "\[DEBUG:" src/`

## Security Considerations

<critical>
NEVER log sensitive data!
</critical>

### Sanitize Before Logging

```javascript
// BAD - logs password
console.log('[DEBUG:auth]', { user, password });

// GOOD - sanitized
console.log('[DEBUG:auth]', {
  user,
  passwordProvided: !!password,
  passwordLength: password?.length
});
```

### Sensitive Data Checklist

Never log:
- Passwords, tokens, API keys
- Personal identifiable information (PII)
- Credit card numbers
- Session identifiers
- Internal IP addresses (in production)

## Iterative Log Technique

Sometimes one round isn't enough:

```
┌─────────────────────────────────────┐
│  1. Add initial logs at boundaries  │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│  2. User runs & shares logs         │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│  3. Analyze - found root cause?     │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
   [YES]              [NO]
      │                 │
      ▼                 ▼
┌─────────────┐  ┌──────────────────┐
│ Remove logs │  │ Add deeper logs  │
│ & fix issue │  │ & repeat step 2  │
└─────────────┘  └──────────────────┘
```

## Quick Reference Card

```
┌────────────────────────────────────────────┐
│           LOG TECHNIQUE CHECKLIST          │
├────────────────────────────────────────────┤
│ □ Identify suspected area                  │
│ □ Add entry/exit logs                      │
│ □ Add decision point logs                  │
│ □ Add async boundary logs (if applicable)  │
│ □ Sanitize sensitive data                  │
│ □ Track all added logs                     │
│ □ Ask user to run & share                  │
│ □ Analyze returned logs                    │
│ □ Iterate if needed                        │
│ □ Remove ALL debug logs when done          │
└────────────────────────────────────────────┘
```
