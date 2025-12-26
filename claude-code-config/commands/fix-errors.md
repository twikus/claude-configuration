---
description: Automatically fix iOS and watchOS build errors
argument-hint: [iPhone|Watch|both (optional, defaults to both)]
---

<objective>
Fix build errors automatically for PadelPro iOS and watchOS targets by running builds, analyzing errors, and applying fixes.
</objective>

<context>
PadelPro has two build targets:
- **iPhone**: `xcodebuild -scheme PadelPro -destination 'platform=iOS Simulator,name=iPhone 16' build`
- **Watch**: `xcodebuild -scheme "PadelProWatch" -destination 'platform=watchOS Simulator,name=Apple Watch Series 10 (46mm)' build`

The command accepts an optional target parameter to specify which platform to fix.
</context>

<process>
1. **Determine target(s)**: Parse #$ARGUMENTS to identify which platform(s) to build
   - "iPhone" or "iOS" → iOS only
   - "Watch" or "watchOS" → watchOS only
   - No argument or "both" → Both platforms

2. **Run initial build(s)**: Execute xcodebuild command(s) for the target platform(s)
   - Capture full build output including all errors and warnings
   - Parse error messages for file paths, line numbers, and error descriptions

3. **Analyze errors**: Review build output to identify:
   - Compilation errors (syntax, type mismatches, missing imports)
   - SwiftData model issues
   - Missing symbols or undefined references
   - Deprecated API usage
   - Group errors by file for efficient fixing

4. **Apply fixes**: For each error encountered (in order):
   - Read the file containing the error
   - Understand the context and root cause
   - Apply the appropriate fix using Edit tool
   - Continue to next error without re-building yet

5. **Verify fixes**: After all errors have been addressed:
   - Re-run the build command(s)
   - If build succeeds → report success
   - If new errors appear → repeat from step 3 (max 3 iterations)
   - If errors persist after 3 iterations → report unfixable errors

6. **Report results**: Provide clear summary:
   - Number of errors fixed
   - Files modified
   - Build status (success/failure)
   - Any remaining errors that couldn't be fixed automatically
     </process>

<error_handling>
**Fixable errors** (attempt automatic fixes):

- Missing imports: Add appropriate import statements
- Type mismatches: Adjust types or add type conversions
- Deprecated APIs: Replace with current equivalents
- SwiftData query syntax: Fix @Query property wrappers
- Optional unwrapping: Add proper nil handling

**Unfixable errors** (report to user):

- Architecture/design issues requiring user decisions
- Missing files or resources
- Complex logic errors requiring domain knowledge
- Errors that persist after 3 fix attempts

When encountering unfixable errors, provide:

- Error description and location (file:line)
- Why it couldn't be fixed automatically
- Suggested next steps for the user
  </error_handling>

<output_format>
**During execution:**

```
Building [target]...
Found X errors in Y files
Fixing errors:
  ✓ Fixed import in File.swift:42
  ✓ Fixed type mismatch in View.swift:78
  ...
Re-building to verify fixes...
```

**On success:**

```
✅ Build successful!
Fixed X errors across Y files:
  - File1.swift (3 errors)
  - File2.swift (1 error)
```

**On partial success:**

```
⚠️ Build completed with remaining errors
Fixed X errors, Y errors remain:

Unfixable errors:
  File.swift:123 - [error description]
  Reason: [why it couldn't be fixed]
  Suggestion: [what user should do]
```

</output_format>

<examples>
```bash
# Fix errors in both iOS and watchOS
/fix-errors

# Fix errors in iOS app only

/fix-errors iPhone

# Fix errors in watchOS app only

/fix-errors Watch

```
</examples>

<success_criteria>
- Build command(s) executed for specified target(s)
- All fixable errors identified and corrected
- Build succeeds after fixes, or unfixable errors clearly reported
- User understands what was fixed and what remains (if anything)
</success_criteria>
```
