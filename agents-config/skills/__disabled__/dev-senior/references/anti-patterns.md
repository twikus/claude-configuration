# Common Anti-Patterns and How to Fix Them

## Critical Anti-Patterns

### 1. Multiple Clients Anti-Pattern

**The Problem:**
Creating multiple clients for the same external service.

**Why It Happens:**
- Developer doesn't search for existing clients
- Different library chosen "because it's newer"
- Copy-paste from StackOverflow/tutorials

**Example (BAD):**
```typescript
// lib/cache.ts - using library A
import { Client } from "library-a";
export const cacheClient = new Client(config);

// features/realtime.ts - using library B
import { Client } from "library-b";
const realtimeClient = new Client(config);

// services/queue.ts - third instance
import { Client } from "library-a";
const queueClient = new Client(config);
```

**Fix:**
```typescript
// lib/service.ts - SINGLE SOURCE OF TRUTH
import { Client } from "chosen-library";

export const client = new Client(config);

// Everywhere else:
import { client } from "@/lib/service";
```

**Prevention:**
1. Search codebase before creating any client
2. Check `lib/` directory first
3. Enforce in code review

---

### 2. Config Scatter Anti-Pattern

**The Problem:**
Same environment variable read in multiple places.

**Example (BAD):**
```typescript
// api/stripe.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// services/payment.ts
const apiKey = process.env.STRIPE_SECRET_KEY;

// webhooks/stripe.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

**Fix:**
```typescript
// lib/config.ts
export const config = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
} as const;

// lib/stripe.ts
import { config } from "./config";
export const stripe = new Stripe(config.stripe.secretKey);

// Everywhere uses lib/stripe.ts
```

---

### 3. Copy-Paste Logic Anti-Pattern

**The Problem:**
Same business logic duplicated across files.

**Example (BAD):**
```typescript
// pages/checkout.tsx
const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
const tax = subtotal * 0.2;
const total = subtotal + tax;

// pages/cart.tsx
const cartSubtotal = cart.reduce((s, item) => s + item.price * item.qty, 0);
const cartTax = cartSubtotal * 0.2;
const cartTotal = cartSubtotal + cartTax;

// api/invoice.ts
const invoiceSubtotal = lines.reduce((acc, l) => acc + l.unitPrice * l.count, 0);
const invoiceTax = invoiceSubtotal * 0.2;
const invoiceTotal = invoiceSubtotal + invoiceTax;
```

**Fix:**
```typescript
// lib/pricing.ts
type LineItem = { price: number; quantity: number };

export function calculateTotals(items: LineItem[], taxRate = 0.2) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

// Everywhere:
const { subtotal, tax, total } = calculateTotals(items);
```

---

### 4. Premature Abstraction Anti-Pattern

**The Problem:**
Creating abstractions before they're needed.

**Example (BAD):**
```typescript
// "We might need other payment providers later"
interface PaymentProvider {
  charge(amount: number): Promise<PaymentResult>;
  refund(id: string): Promise<RefundResult>;
}

class StripeProvider implements PaymentProvider { ... }

const paymentProviders: Record<string, PaymentProvider> = {
  stripe: new StripeProvider(),
};

function getPaymentProvider(type: string): PaymentProvider {
  return paymentProviders[type];
}

// Usage
const provider = getPaymentProvider("stripe");
await provider.charge(100);
```

**Fix (When Only One Provider):**
```typescript
// Just use Stripe directly
import { stripe } from "@/lib/stripe";

await stripe.charges.create({ amount: 100 });

// Add abstraction WHEN you actually add a second provider
```

---

### 5. God File Anti-Pattern

**The Problem:**
One file that does everything related to a domain.

**Example (BAD):**
```typescript
// user.ts (500+ lines)
export const createUser = ...
export const updateUser = ...
export const deleteUser = ...
export const validateUserEmail = ...
export const validateUserPassword = ...
export const hashPassword = ...
export const formatUserName = ...
export const sendWelcomeEmail = ...
export const sendPasswordReset = ...
export const generateAvatar = ...
export const calculateUserStats = ...
// ... more and more
```

**Fix:**
```
user/
├── repository.ts    # CRUD operations
├── validation.ts    # Input validation
├── formatting.ts    # Display formatting
├── auth.ts          # Password, sessions
└── notifications.ts # Emails
```

---

### 6. Boolean Blindness Anti-Pattern

**The Problem:**
Functions that return or accept booleans without clear meaning.

**Example (BAD):**
```typescript
// What does true/false mean here?
processOrder(order, true, false, true);

function processOrder(
  order: Order,
  sendEmail: boolean,
  skipValidation: boolean,
  priority: boolean
) { ... }
```

**Fix:**
```typescript
// Option 1: Options object
processOrder(order, {
  sendEmail: true,
  skipValidation: false,
  priority: true,
});

// Option 2: Separate functions
processOrderWithEmail(order);
processUrgentOrder(order);

// Option 3: Enum for modes
processOrder(order, ProcessMode.EXPRESS);
```

---

### 7. Magic Values Anti-Pattern

**The Problem:**
Hard-coded values without explanation.

**Example (BAD):**
```typescript
if (user.role === 1) { ... }
if (retries > 3) { ... }
const timeout = 30000;
```

**Fix:**
```typescript
// Constants with meaningful names
const ADMIN_ROLE = 1;
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 30000;

// Or enums
enum UserRole {
  User = 0,
  Admin = 1,
  SuperAdmin = 2,
}

if (user.role === UserRole.Admin) { ... }
```

---

### 8. Callback Hell Anti-Pattern

**The Problem:**
Deeply nested callbacks instead of async/await.

**Example (BAD):**
```typescript
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getPosts(user.id, (err, posts) => {
    if (err) return handleError(err);
    getComments(posts[0].id, (err, comments) => {
      if (err) return handleError(err);
      // Finally do something
    });
  });
});
```

**Fix:**
```typescript
async function getData(userId: string) {
  const user = await getUser(userId);
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);
  return { user, posts, comments };
}
```

---

### 9. Props Drilling Anti-Pattern (React)

**The Problem:**
Passing props through many component layers.

**Example (BAD):**
```tsx
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user}>
        <Avatar src={user.avatar} />
      </UserMenu>
    </Sidebar>
  </Layout>
</App>
```

**Fix:**
```tsx
// Context for truly global state
const UserContext = createContext<User | null>(null);

function App() {
  return (
    <UserContext.Provider value={user}>
      <Layout>
        <Sidebar />
      </Layout>
    </UserContext.Provider>
  );
}

function Avatar() {
  const user = useContext(UserContext);
  return <img src={user?.avatar} />;
}
```

---

### 10. Anemic Domain Model Anti-Pattern

**The Problem:**
Data objects with no behavior, logic scattered in services.

**Example (BAD):**
```typescript
// Just data
class User {
  name: string;
  email: string;
  balance: number;
}

// Logic scattered everywhere
class UserService {
  canAfford(user: User, amount: number) {
    return user.balance >= amount;
  }
  deductBalance(user: User, amount: number) {
    user.balance -= amount;
  }
}
```

**Fix:**
```typescript
// Data + related behavior together
class User {
  constructor(
    public name: string,
    public email: string,
    private balance: number
  ) {}

  canAfford(amount: number): boolean {
    return this.balance >= amount;
  }

  deductBalance(amount: number): void {
    if (!this.canAfford(amount)) {
      throw new Error("Insufficient balance");
    }
    this.balance -= amount;
  }
}
```

---

## Quick Reference Table

| Anti-Pattern | Symptom | Fix |
|--------------|---------|-----|
| Multiple Clients | 2+ clients for same service | Single client in `lib/` |
| Config Scatter | `process.env.X` in many files | Central config object |
| Copy-Paste Logic | Same code 3+ places | Extract to utility |
| Premature Abstraction | Interface with 1 implementation | Use concrete class |
| God File | File > 300 lines | Split by responsibility |
| Boolean Blindness | `func(true, false, true)` | Options object or enums |
| Magic Values | Hard-coded numbers | Named constants |
| Callback Hell | Nested callbacks | async/await |
| Props Drilling | Props through 3+ levels | Context or composition |
| Anemic Domain | Data objects + service logic | Methods on domain objects |
