---
name: codeline
description: "Manage Codeline (school/course platform) via CLI - products, orders, users, coupons, tools. Use when user mentions 'codeline', 'codeline-cli', 'codeline order', 'codeline product', 'student access', 'grant section access', 'revoke section access', 'grant full access', 'create coupon', 'school platform order', 'course platform user', or wants to list/get products/orders/users, manage coupons (percentage/fixed/expiring/product-specific), grant/revoke section or full course access, or run arbitrary Codeline API tools."
category: e-commerce
---

# codeline-cli

## Setup

If `codeline-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle codeline
npx api2cli link codeline
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
codeline-cli auth set "your-token"
codeline-cli auth test
```

## Resources

### tools

| Command | Description |
|---------|-------------|
| `codeline-cli tools list --json` | List all available tools |
| `codeline-cli tools run --tool list_products --json` | Run tool by name |
| `codeline-cli tools run --tool get_user --params '{"email":"test@example.com"}' --json` | Run tool with JSON parameters |
| `codeline-cli tools run --tool list_orders --params '{"limit":10}' --fields id,status --json` | Run tool with custom field output |

### products

| Command | Description |
|---------|-------------|
| `codeline-cli products list --json` | List all products |
| `codeline-cli products list --fields id,name,price --json` | List with specific columns |
| `codeline-cli products get --id abc123 --json` | Get product by ID |

### orders

| Command | Description |
|---------|-------------|
| `codeline-cli orders list --json` | List all orders |
| `codeline-cli orders list --limit 10 --json` | List orders with max results |
| `codeline-cli orders list --fields id,status,total --json` | List with custom columns |
| `codeline-cli orders get --id abc123 --json` | Get order by ID |

### users

| Command | Description |
|---------|-------------|
| `codeline-cli users list --json` | List all users |
| `codeline-cli users list --fields id,email,name --json` | List users with columns |
| `codeline-cli users get --id abc123 --json` | Get user by ID (includes section-level access details) |
| `codeline-cli users get --id "test@example.com" --json` | Get user by email address |
| `codeline-cli users grant-section-access --user "email" --product-id abc --section-id xyz --json` | Unlock a specific section for a user |
| `codeline-cli users revoke-section-access --user "email" --product-id abc --section-id xyz --json` | Lock a specific section for a user |
| `codeline-cli users grant-full-access --user "email" --product-id abc --json` | Grant full access to all sections (remove tier restrictions) |

### coupons

| Command | Description |
|---------|-------------|
| `codeline-cli coupons list --json` | List all coupons |
| `codeline-cli coupons list --fields code,discount,type --json` | List with specific columns |
| `codeline-cli coupons create --code SAVE20 --discount 20 --json` | Create percentage discount (20%) |
| `codeline-cli coupons create --code FLAT10 --discount 10 --type fixed --json` | Create fixed amount coupon |
| `codeline-cli coupons create --code LAUNCH --discount 50 --max-uses 100 --json` | Create with usage limit |
| `codeline-cli coupons create --code SPECIAL --discount 15 --expires-at "2026-12-31" --json` | Create with expiration |
| `codeline-cli coupons create --code PRODUCT5 --discount 5 --product-id xyz789 --json` | Create for specific product |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`

## Pricing & Coupon Rules (CRITICAL)

**ALL monetary amounts on Codeline are stored in CENTS (integer), never in euros.**

- Product/bundle `price` field is in **cents** (e.g. `40000` = 400€, `140000` = 1400€).
- Coupon `discountAmount` is in **cents** (e.g. `20100` = 201€ off, `60100` = 601€ off).
- The CLI's `--discount` flag for `coupons create` is also in cents.

### MANDATORY workflow before creating any pricing coupon

1. **Always fetch the actual current price first** — never assume:
   ```bash
   codeline-cli products get --id prd_XXX --json
   # or
   codeline-cli tools run --tool get_bundle --params '{"bundleId":"bdl_XXX"}' --json
   ```
   Read the `prices[].price` field (in cents). There can be multiple prices per product/bundle (ONE_TIME, MULTI_TIME).

2. **Compute discount explicitly**:
   `discount_cents = current_price_cents - desired_final_price_cents`
   Then multiply by 100 if you started in euros. Example:
   - Product is at 40000 cents (400€), target final price 199€ → discount = `40000 - 19900 = 20100` cents.
   - Bundle is at 140000 cents (1400€), target final price 799€ → discount = `140000 - 79900 = 60100` cents.

3. **Never confuse marketing "originalPrice" with the Codeline price**. The displayed crossed-out price on a landing page is independent from the actual Codeline `price`. The coupon discount MUST be based on the actual Codeline price, not the marketing display.

4. **Scope the coupon** to the right product/bundle with `productIds` or `bundleIds` so it cannot be applied elsewhere:
   ```bash
   codeline-cli tools run --tool create_coupon --params '{"code":"PROMO-199","discountAmount":20100,"currency":"EUR","productIds":["prd_XXX"]}' --json
   ```

5. **Verify by reading the returned `checkoutUrls`** — Codeline returns the canonical checkout URL (slug-based like `https://codeline.app/cdly/checkout/<slug>?coupon=<CODE>`). Use that URL in code, not the raw bundle/product ID, for forward-compat.

6. **Editing an existing coupon** uses the same cents convention:
   ```bash
   codeline-cli tools run --tool edit_coupon --params '{"code":"PROMO-199","discountAmount":20100}' --json
   ```

### Common pitfalls (do not repeat)

- ❌ Reading `price: 40000` and treating it as 40000€ (it's 400€).
- ❌ Computing the discount against the marketing originalPrice (e.g. 1600€) when the Codeline price is different (e.g. 1400€) — the user would end up paying the wrong amount.
- ❌ Passing the discount in euros instead of cents (e.g. `discountAmount: 201` instead of `20100` → only removes 2.01€).

## Lesson Content Rules (MDX)

**CRITICAL** rules when writing lesson content (via `edit_lesson_draft`):

- **NEVER use `<Caption>`** - this component is NOT authorized. Always use `<Callout>` instead.
  - `<Callout emoji="💡">tip text</Callout>` (correct)
  - `<Caption emoji="💡">tip text</Caption>` (WRONG - do not use)
- Use `<Callout emoji="...">` for tips, quick remarks, or emphasized notes (this is the Caption alias that IS authorized)
- Other authorized components: `<Alert color="...">`, `<Note>`, `<Hint>`, `<Action>`, `<Tella url="...">`, `<Frame src="...">`, `<Spoiler>`, etc.
- Call `lesson_info` tool first if unsure about available components.
