# Recommended Tools & Stack

Reference document for technical decisions in SaaS projects.

---

## Core Framework

| Tool | Purpose | Why |
|------|---------|-----|
| **Next.js 15** | Full-stack framework | App Router, RSC, great DX, Vercel integration |
| **TypeScript** | Type safety | Catch errors early, better IDE support |
| **Tailwind CSS v4** | Styling | Fast, consistent, utility-first |

## UI & Components

| Tool | Purpose | When to use |
|------|---------|-------------|
| **shadcn/ui** | Component library | Always - accessible, customizable |
| **Lucide React** | Icons | Default icon set |
| **Sonner** | Toast notifications | User feedback |
| **cmdk** | Command palette | Power user features |

## State & Data Fetching

| Tool | Purpose | When to use |
|------|---------|-------------|
| **TanStack Query** | Server state | API data, caching, mutations |
| **nuqs** | URL state | Filters, pagination, shareable state |
| **Zustand** | Client state | Complex UI state (use sparingly) |
| **React Hook Form** | Forms | All forms with validation |
| **Zod v4** | Validation | Schema validation everywhere |

## Backend & API

| Tool | Purpose | When to use |
|------|---------|-------------|
| **Server Actions** | Mutations | Default for data mutations |
| **next-safe-action** | Type-safe actions | Wrap all server actions |
| **next-zod-route** | API routes | When REST endpoints needed |
| **Prisma** | ORM | Database access |

## Database

| Option | Best for | Trade-offs |
|--------|----------|------------|
| **Neon** | Most projects | Free tier, serverless Postgres |
| **Supabase** | Real-time + auth | More features, different paradigm |
| **PlanetScale** | Scale needs | MySQL, branching |

## Authentication

| Tool | Purpose | When to use |
|------|---------|-------------|
| **Better Auth** | Auth solution | Default - flexible, self-hosted |
| **Clerk** | Managed auth | When you want zero auth code |

### Auth Methods

| Method | Complexity | UX |
|--------|------------|-----|
| Email + Password | 🟢 Low | Traditional |
| Magic Link / OTP | 🟢 Low | Modern, passwordless |
| OAuth (Google/GitHub) | 🟡 Medium | Convenient for devs |
| All combined | 🟡 Medium | Maximum flexibility |

## Email

| Tool | Purpose | Free tier |
|------|---------|-----------|
| **Resend** | Transactional email | 3,000/month |
| **React Email** | Email templates | Unlimited |

## Payments

| Tool | Best for | Trade-offs |
|------|----------|------------|
| **Stripe** | Most projects | Most flexible, well-documented |
| **Lemon Squeezy** | Simplicity | Handles taxes, less flexible |

## Analytics & Monitoring

| Tool | Purpose | When to add |
|------|---------|-------------|
| **PostHog** | Product analytics | Post-launch |
| **Sentry** | Error tracking | Post-launch |
| **Vercel Analytics** | Web vitals | Free with Vercel |

## Deployment

| Tool | Purpose | Why |
|------|---------|-----|
| **Vercel** | Hosting | Best Next.js integration |
| **GitHub Actions** | CI/CD | Automated testing |

---

## Decision Matrix

### When to use what

| Need | Solution |
|------|----------|
| Simple CRUD app | Next.js + Prisma + Neon |
| Real-time features | Supabase or Convex |
| AI features | Vercel AI SDK |
| File uploads | Uploadthing or S3 |
| Background jobs | Trigger.dev or Inngest |
| Search | Algolia or Typesense |
| Caching | Upstash Redis |

---

## Cost Estimation Template

### At 1,000 users/month

| Service | Free tier | Paid |
|---------|-----------|------|
| Vercel | 100GB bandwidth | $20/mo |
| Neon | 10GB storage | $19/mo |
| Resend | 3,000 emails | $20/mo |
| **Total** | ~$0 | ~$59/mo |

### At 10,000 users/month

| Service | Estimate |
|---------|----------|
| Vercel | $20-50/mo |
| Database | $50-100/mo |
| Email | $50/mo |
| **Total** | ~$120-200/mo |
