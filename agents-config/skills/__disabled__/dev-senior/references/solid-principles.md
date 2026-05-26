# SOLID Principles for TypeScript

## Overview

SOLID principles guide maintainable, scalable code. Apply them pragmatically—don't over-engineer.

| Principle | Summary | When to Apply |
|-----------|---------|---------------|
| **S**ingle Responsibility | One reason to change | Always |
| **O**pen/Closed | Extend, don't modify | When adding features |
| **L**iskov Substitution | Subtypes must be substitutable | When using inheritance |
| **I**nterface Segregation | Small, focused interfaces | When designing APIs |
| **D**ependency Inversion | Depend on abstractions | When decoupling modules |

---

## S - Single Responsibility Principle

**Each module should have one reason to change.**

### Problem: God Class
```typescript
// BAD: UserService does everything
class UserService {
  createUser(data: UserData) { ... }
  sendWelcomeEmail(user: User) { ... }
  validatePassword(password: string) { ... }
  generateReport(users: User[]) { ... }
  syncWithCRM(user: User) { ... }
}
```

### Solution: Focused Classes
```typescript
// GOOD: Each class has one job
class UserRepository {
  create(data: UserData) { ... }
  findById(id: string) { ... }
}

class EmailService {
  sendWelcome(user: User) { ... }
}

class PasswordValidator {
  validate(password: string) { ... }
}
```

### File-Level SRP
```typescript
// BAD: One file doing everything
// user.ts
export const createUser = ...
export const validateUser = ...
export const formatUser = ...
export const sendUserEmail = ...
export const userStyles = ...

// GOOD: Organized by responsibility
// user/repository.ts
// user/validation.ts
// user/formatting.ts
// notifications/email.ts
```

---

## O - Open/Closed Principle

**Open for extension, closed for modification.**

### Problem: Modification Required
```typescript
// BAD: Must modify this function for each new payment type
function processPayment(type: string, amount: number) {
  if (type === "credit") {
    // credit card logic
  } else if (type === "paypal") {
    // paypal logic
  } else if (type === "crypto") {
    // crypto logic - had to modify existing code!
  }
}
```

### Solution: Extensible Design
```typescript
// GOOD: Add new payment types without modifying existing code
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>;
}

class CreditCardProcessor implements PaymentProcessor {
  process(amount: number) { ... }
}

class PayPalProcessor implements PaymentProcessor {
  process(amount: number) { ... }
}

// Adding crypto doesn't touch existing code
class CryptoProcessor implements PaymentProcessor {
  process(amount: number) { ... }
}

const processors: Record<string, PaymentProcessor> = {
  credit: new CreditCardProcessor(),
  paypal: new PayPalProcessor(),
  crypto: new CryptoProcessor(),
};
```

### When NOT to Apply

Don't create abstractions for single implementations:

```typescript
// OVER-ENGINEERING: Only one payment method exists
interface PaymentProcessor { ... }
class StripeProcessor implements PaymentProcessor { ... }
const processor: PaymentProcessor = new StripeProcessor();

// BETTER: Just use Stripe directly
const stripe = new Stripe(key);
```

---

## L - Liskov Substitution Principle

**Subtypes must be substitutable for their base types.**

### Problem: Broken Substitution
```typescript
// BAD: Square breaks Rectangle's contract
class Rectangle {
  constructor(public width: number, public height: number) {}

  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }

  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(w: number) {
    this.width = w;
    this.height = w; // Violates expected behavior!
  }
  setHeight(h: number) {
    this.width = h;
    this.height = h;
  }
}

// This breaks expectations
function doubleWidth(rect: Rectangle) {
  rect.setWidth(rect.width * 2);
  // For Rectangle: area doubles
  // For Square: area quadruples - SURPRISE!
}
```

### Solution: Proper Abstraction
```typescript
// GOOD: Separate types, no inheritance
interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}
  area() { return this.width * this.height; }
}

class Square implements Shape {
  constructor(public side: number) {}
  area() { return this.side * this.side; }
}
```

---

## I - Interface Segregation Principle

**Clients shouldn't depend on interfaces they don't use.**

### Problem: Fat Interface
```typescript
// BAD: One interface with everything
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
  writeReport(): void;
}

// Robot can't eat or sleep!
class Robot implements Worker {
  work() { ... }
  eat() { throw new Error("Robots don't eat"); }
  sleep() { throw new Error("Robots don't sleep"); }
  // ...
}
```

### Solution: Focused Interfaces
```typescript
// GOOD: Small, focused interfaces
interface Workable {
  work(): void;
}

interface Feedable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Human implements Workable, Feedable, Sleepable {
  work() { ... }
  eat() { ... }
  sleep() { ... }
}

class Robot implements Workable {
  work() { ... }
}
```

### React Component Props
```typescript
// BAD: Component receives props it doesn't use
type Props = {
  user: User;
  posts: Post[];
  comments: Comment[];
  settings: Settings;
};

function UserAvatar({ user, posts, comments, settings }: Props) {
  // Only uses user.avatar
  return <img src={user.avatar} />;
}

// GOOD: Only receive what's needed
type AvatarProps = {
  src: string;
  alt: string;
};

function Avatar({ src, alt }: AvatarProps) {
  return <img src={src} alt={alt} />;
}
```

---

## D - Dependency Inversion Principle

**Depend on abstractions, not concretions.**

### Problem: Tight Coupling
```typescript
// BAD: Direct dependency on concrete implementation
class OrderService {
  private db = new PostgresDatabase();
  private email = new SendGridEmailer();

  createOrder(data: OrderData) {
    this.db.save(data);
    this.email.send("Order created");
  }
}
```

### Solution: Depend on Abstractions
```typescript
// GOOD: Depend on interfaces
interface Database {
  save(data: unknown): Promise<void>;
}

interface Emailer {
  send(message: string): Promise<void>;
}

class OrderService {
  constructor(
    private db: Database,
    private email: Emailer
  ) {}

  createOrder(data: OrderData) {
    this.db.save(data);
    this.email.send("Order created");
  }
}

// Easy to test with mocks
const mockDb: Database = { save: jest.fn() };
const mockEmail: Emailer = { send: jest.fn() };
new OrderService(mockDb, mockEmail);
```

### When NOT to Apply

Don't abstract stable, universal dependencies:

```typescript
// OVER-ENGINEERING: Abstracting console.log
interface Logger { log(msg: string): void; }
class ConsoleLogger implements Logger { ... }

// JUST USE IT
console.log("message");
```

---

## Pragmatic Application

### Always Apply
- **SRP**: Keep files and functions focused
- **ISP**: Keep interfaces small

### Apply When Needed
- **OCP**: When you're actually adding new variants
- **DIP**: When you need testability or flexibility

### Avoid Over-Engineering
- Don't create interfaces for single implementations
- Don't add abstraction layers "just in case"
- Three concrete implementations usually means you need an abstraction

## Summary Table

| Principle | Do | Don't |
|-----------|-----|-------|
| SRP | One file = one purpose | God files/classes |
| OCP | Strategy pattern for variants | if/else chains for types |
| LSP | Composition over inheritance | Broken subtype contracts |
| ISP | Small, focused interfaces | Fat interfaces |
| DIP | Inject dependencies for testing | Abstract everything |
