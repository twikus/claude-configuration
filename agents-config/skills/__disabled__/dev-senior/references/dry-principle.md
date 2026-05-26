# DRY Principle - Don't Repeat Yourself

## Core Concept

Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.

DRY is not just about code duplication—it's about **knowledge duplication**. The same business logic, configuration, or pattern should exist in exactly one place.

## The Rule of Three

**Don't abstract too early.** Wait until you see the pattern three times before extracting.

```typescript
// First occurrence: Just write it
const user = await db.user.findFirst({ where: { email } });

// Second occurrence: Note it, but don't abstract yet
const admin = await db.user.findFirst({ where: { email: adminEmail } });

// Third occurrence: NOW extract
// lib/db/users.ts
export const findUserByEmail = (email: string) =>
  db.user.findFirst({ where: { email } });
```

## Categories of Duplication

### 1. Code Duplication (Most Obvious)

**Problem:**
```typescript
// file-a.ts
const response = await fetch(API_URL + "/users", {
  headers: { Authorization: `Bearer ${token}` },
});
const users = await response.json();

// file-b.ts
const response = await fetch(API_URL + "/products", {
  headers: { Authorization: `Bearer ${token}` },
});
const products = await response.json();
```

**Solution:**
```typescript
// lib/api.ts
export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(API_URL + path, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.json();
  },
};

// Usage everywhere
const users = await apiClient.get<User[]>("/users");
const products = await apiClient.get<Product[]>("/products");
```

### 2. Configuration Duplication

**Problem:**
```typescript
// payment.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// subscription.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// webhook.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

**Solution:**
```typescript
// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Everywhere else
import { stripe } from "@/lib/stripe";
```

### 3. Client Duplication (Critical)

Never have multiple clients for the same service.

**Problem:**
```typescript
// file-a.ts - using library A
import { Client } from "library-a";
export const client = new Client(config);

// file-b.ts - using library B for same service
import { Client } from "library-b";
const client = new Client(config);
```

**Solution:**
```typescript
// lib/service.ts - ONE client, ONE library
import { Client } from "chosen-library";

export const client = new Client(config);

// Everywhere else imports this single client
import { client } from "@/lib/service";
```

### 4. Logic Duplication

**Problem:**
```typescript
// checkout.ts
const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const tax = total * 0.2;
const finalPrice = total + tax;

// invoice.ts
const subtotal = lineItems.reduce((s, i) => s + i.price * i.qty, 0);
const vat = subtotal * 0.2;
const totalPrice = subtotal + vat;
```

**Solution:**
```typescript
// lib/pricing.ts
export const calculateTotal = (items: Array<{ price: number; quantity: number }>) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.2;
  return { subtotal, tax, total: subtotal + tax };
};
```

### 5. Type Duplication

**Problem:**
```typescript
// api/users.ts
type User = { id: string; email: string; name: string };

// components/UserCard.tsx
interface User { id: string; email: string; name: string }

// hooks/useUser.ts
type UserType = { id: string; email: string; name: string };
```

**Solution:**
```typescript
// types/user.ts
export type User = {
  id: string;
  email: string;
  name: string;
};

// Import everywhere
import type { User } from "@/types/user";
```

## When NOT to Apply DRY

### Coincidental Duplication

Sometimes code looks the same but represents different concepts:

```typescript
// These LOOK similar but are semantically different
const userValidation = { required: true, minLength: 3 };
const productValidation = { required: true, minLength: 3 };

// DON'T merge them - they might evolve differently
// User names might need different rules than product names
```

### Over-Abstraction

**Problem (Too DRY):**
```typescript
// This is over-engineering
const genericHandler = <T>(
  fetcher: () => Promise<T>,
  transformer: (data: T) => unknown,
  validator: (data: unknown) => boolean
) => { ... };
```

**Better (Appropriate Duplication):**
```typescript
// Just write the specific handlers
const fetchUsers = async () => { ... };
const fetchProducts = async () => { ... };
```

## File Organization for DRY

```
src/
├── lib/           # Shared clients and utilities
│   ├── redis.ts   # Single Redis client
│   ├── stripe.ts  # Single Stripe client
│   ├── db.ts      # Single database client
│   └── api.ts     # API utilities
├── types/         # Shared type definitions
│   ├── user.ts
│   └── product.ts
├── utils/         # Pure utility functions
│   ├── format.ts
│   └── validation.ts
└── config/        # Configuration (one source)
    └── env.ts
```

## Checklist Before Writing New Code

1. **Does this functionality already exist?**
   - Search codebase for similar functions
   - Check `lib/`, `utils/`, `helpers/` directories

2. **Is there an existing client I should use?**
   - Check `lib/` for service clients
   - Never create a second client for the same service

3. **Is there a type I should import?**
   - Check `types/` directory
   - Don't redefine existing types

4. **Am I copying code from another file?**
   - If yes, extract to shared location instead

## Summary

| Type | Bad | Good |
|------|-----|------|
| Clients | Multiple clients for same service | One client in `lib/` |
| Config | `process.env.X` everywhere | One config object |
| Types | Same type defined 3 times | One type in `types/` |
| Logic | Copy-paste business logic | Extract to utility |
| API calls | Duplicate fetch setup | Shared API client |
