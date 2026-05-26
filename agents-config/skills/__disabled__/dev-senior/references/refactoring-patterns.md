# Safe Refactoring Patterns

## Core Principle

Refactor in small, verified steps. Each step should:
1. Keep tests passing
2. Be independently reviewable
3. Be easily reversible

---

## Pattern 1: Extract Utility

**When:** Same logic appears 3+ times.

**Steps:**
1. Identify the duplicated code
2. Write the utility function with tests
3. Replace one usage, verify tests pass
4. Replace remaining usages one by one
5. Delete old code

**Example:**

Before:
```typescript
// file-a.ts
const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

// file-b.ts
const urlSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
```

After:
```typescript
// lib/string.ts
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

// file-a.ts
import { slugify } from "@/lib/string";
const slug = slugify(title);

// file-b.ts
import { slugify } from "@/lib/string";
const urlSlug = slugify(name);
```

---

## Pattern 2: Consolidate Clients

**When:** Multiple clients exist for the same service.

**Steps:**
1. Identify all clients for the service
2. Choose or create the canonical client in `lib/`
3. Update one file to use canonical client
4. Test that file thoroughly
5. Repeat for remaining files
6. Remove unused client imports/packages

**Example:**

Before:
```typescript
// lib/cache.ts - using library A
import { Client } from "library-a";
export const cacheClient = new Client(config);

// features/realtime.ts - using library B
import { Client } from "library-b";
const realtimeClient = new Client(config);
```

After:
```typescript
// lib/service.ts (canonical - pick ONE library)
import { Client } from "chosen-library";
export const client = new Client(config);

// lib/cache.ts
import { client } from "./service";

// features/realtime.ts
import { client } from "@/lib/service";
```

---

## Pattern 3: Extract Component

**When:** A component does too much or has reusable parts.

**Steps:**
1. Identify the extractable piece
2. Create new component with same props
3. Replace inline JSX with component
4. Verify visually and with tests
5. Refine props interface

**Example:**

Before:
```tsx
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <div className="avatar">
        <img src={user.avatar} alt={user.name} />
        {user.isOnline && <span className="online-badge" />}
      </div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
```

After:
```tsx
function Avatar({ src, name, isOnline }: AvatarProps) {
  return (
    <div className="avatar">
      <img src={src} alt={name} />
      {isOnline && <span className="online-badge" />}
    </div>
  );
}

function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <Avatar src={user.avatar} name={user.name} isOnline={user.isOnline} />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
```

---

## Pattern 4: Extract Configuration

**When:** Environment variables or config values are scattered.

**Steps:**
1. Identify all `process.env` usages
2. Create `lib/config.ts` with typed config
3. Replace usages one file at a time
4. Add validation for required values
5. Remove direct `process.env` access

**Example:**

Before:
```typescript
// Multiple files reading env vars directly
const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;
```

After:
```typescript
// lib/config.ts
import { z } from "zod";

const configSchema = z.object({
  api: z.object({
    url: z.string().url(),
    key: z.string().min(1),
  }),
});

export const config = configSchema.parse({
  api: {
    url: process.env.API_URL,
    key: process.env.API_KEY,
  },
});

// Usage
import { config } from "@/lib/config";
const response = await fetch(config.api.url);
```

---

## Pattern 5: Replace Conditional with Polymorphism

**When:** Long if/else or switch statements based on type.

**Steps:**
1. Identify the conditional logic
2. Create interface for the behavior
3. Create implementations for each case
4. Create factory/map to get implementation
5. Replace conditional with polymorphic call
6. Delete old conditional

**Example:**

Before:
```typescript
function calculateShipping(order: Order): number {
  switch (order.shippingMethod) {
    case "standard":
      return order.weight * 0.5;
    case "express":
      return order.weight * 1.5 + 10;
    case "overnight":
      return order.weight * 3 + 25;
    default:
      throw new Error("Unknown shipping method");
  }
}
```

After:
```typescript
interface ShippingCalculator {
  calculate(weight: number): number;
}

const shippingCalculators: Record<string, ShippingCalculator> = {
  standard: { calculate: (w) => w * 0.5 },
  express: { calculate: (w) => w * 1.5 + 10 },
  overnight: { calculate: (w) => w * 3 + 25 },
};

function calculateShipping(order: Order): number {
  const calculator = shippingCalculators[order.shippingMethod];
  if (!calculator) throw new Error("Unknown shipping method");
  return calculator.calculate(order.weight);
}
```

---

## Pattern 6: Split File by Responsibility

**When:** File exceeds 300 lines or has multiple unrelated exports.

**Steps:**
1. Identify logical groupings of exports
2. Create new files for each group
3. Move exports one group at a time
4. Update imports in consuming files
5. Verify after each move

**Example:**

Before:
```
user.ts (500 lines)
├── CRUD operations
├── Validation functions
├── Formatting utilities
└── Auth helpers
```

After:
```
user/
├── index.ts        (re-exports)
├── repository.ts   (CRUD)
├── validation.ts   (validation)
├── format.ts       (formatting)
└── auth.ts         (auth)
```

---

## Pattern 7: Introduce Parameter Object

**When:** Function has many parameters (> 3-4).

**Steps:**
1. Create interface for parameters
2. Update function signature
3. Update all call sites
4. Consider optional properties with defaults

**Example:**

Before:
```typescript
function createUser(
  name: string,
  email: string,
  password: string,
  role: string,
  avatar?: string,
  bio?: string,
  settings?: UserSettings
) { ... }

createUser("John", "john@x.com", "pass123", "user", undefined, undefined, {});
```

After:
```typescript
interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  bio?: string;
  settings?: UserSettings;
}

function createUser(input: CreateUserInput) { ... }

createUser({
  name: "John",
  email: "john@x.com",
  password: "pass123",
  role: "user",
});
```

---

## Pattern 8: Replace Magic Values with Constants

**When:** Hard-coded values appear in code without explanation.

**Steps:**
1. Identify magic values
2. Create named constants near usage or in constants file
3. Replace values with constants
4. Add JSDoc if meaning isn't obvious

**Example:**

Before:
```typescript
if (retries > 3) { ... }
await sleep(30000);
if (user.role === 1) { ... }
```

After:
```typescript
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 30_000;

enum UserRole {
  User = 0,
  Admin = 1,
}

if (retries > MAX_RETRIES) { ... }
await sleep(REQUEST_TIMEOUT_MS);
if (user.role === UserRole.Admin) { ... }
```

---

## Safe Refactoring Checklist

Before starting:
- [ ] Tests exist for affected code
- [ ] Git working directory is clean
- [ ] Feature branch created

During refactoring:
- [ ] One logical change per commit
- [ ] Tests pass after each change
- [ ] No behavior changes (pure refactoring)

After refactoring:
- [ ] All tests pass
- [ ] Manual smoke test
- [ ] PR is reviewable (< 400 lines)

---

## When NOT to Refactor

**Don't refactor when:**
- No tests exist (write tests first)
- Under time pressure (ship first, refactor later)
- You're the only one who thinks it's needed
- The code works and isn't frequently changed

**Rule:** Refactoring is not a goal itself. It serves to make future changes easier.
