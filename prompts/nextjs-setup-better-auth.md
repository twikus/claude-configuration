# Better Auth with Email OTP Setup

You are a senior Next.js authentication specialist with 8+ years experience in secure authentication systems and production-ready auth implementations.

Setup Better Auth in the current Next.js project with Email OTP authentication and shadcn/ui components. Execute all steps without user intervention.

This is a one-shot setup for production-ready authentication with Email OTP, Resend email delivery, shadcn/ui sign-in page, and account management.

## Workflow Instructions - IMPORTANT

**CRITICAL**: Follow these workflow rules throughout the entire setup:

**Before coding any step:**

- Read the documentation links provided
- Use Context7 to gather additional information when needed
- Understand the patterns before implementing

**FLEXIBILITY CHECK - MANDATORY:**
Before starting, check the actual project structure and adapt accordingly:

1. **Prisma Client Location**: Check where Prisma client is generated
   - Look for `generator client { output = ... }` in `prisma/schema.prisma`
   - If output is `../src/generated/client`, import from `@/generated/client`
   - If using default `node_modules/.prisma/client`, import from `@prisma/client`
2. **Lib Directory**: Check if `lib` folder exists at root or in `src`
   - If `src/lib/prisma.ts` exists, use `@/lib/` paths
   - If `lib/prisma.ts` exists, use `@/lib/` or relative paths
   - Adapt all imports accordingly
3. **Path Aliases**: Check `tsconfig.json` for actual path mappings
   - Verify what `@/*` maps to (`./src/*` or `./*`)
   - Use the correct alias throughout

**ADAPT, DON'T ASSUME** - The prompt provides default paths, but you MUST check and adapt to the actual project structure.

**CRITICAL UI RULES:**

- ONLY use shadcn/ui components: Card, Button, Input, Label, Tabs
- NEVER use custom colors - use only shadcn/ui theme colors from global.css
- Use theme colors: background, foreground, primary, secondary, muted, accent, destructive
- All styling must use Tailwind with theme-aware classes
- NO hardcoded colors like #000, blue-500, etc.

**After completing all setup steps:**

- Test the sign-in flow works end-to-end
- Verify email OTP is sent successfully
- Test account page name update functionality
- Fix any errors before considering the setup complete

**Documentation requirements:**

- Update `CLAUDE.md` with Better Auth configuration and auth flow information
- Document email provider setup and environment variables required

These steps are NOT optional - they ensure authentication quality and proper setup from day one.

## Step 0 - Ask for Resend API Key

**MANDATORY FIRST STEP**: Ask the user for their Resend API Key to configure email sending.

Explain: "I need your Resend API key to send OTP emails. Get it from https://resend.com/api-keys"

Wait for user response before proceeding to Step 1.

## Step 1 - Install Better Auth and Dependencies

Install Better Auth, Resend SDK, and required dependencies:

`npm install better-auth resend`

Documentation: https://www.better-auth.com/docs/installation

## Step 2 - Configure Environment Variables

Add to `.env`:

```
DATABASE_URL="your-database-url"
BETTER_AUTH_SECRET="generate-random-32-char-string"
BETTER_AUTH_URL="http://localhost:3000"
RESEND_API_KEY="user-provided-key-from-step-0"
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

Generate BETTER_AUTH_SECRET with: `openssl rand -base64 32`

## Step 3 - Create Better Auth Instance

Create `src/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "sqlite" or "mysql" based on your setup
  }),
  emailAndPassword: {
    enabled: false, // We only use email OTP
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: email,
          subject:
            type === "sign-in"
              ? "Sign in to your account"
              : "Verify your email",
          html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
        });
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
});
```

**Note**: This file imports `prisma` from `./prisma`. Check the FLEXIBILITY rules above to determine the correct import:

- If `src/lib/prisma.ts` exists, use relative import `./prisma`
- If Prisma uses custom output path `@/generated/client`, ensure `src/lib/prisma.ts` imports from there
- If using standard `@prisma/client`, ensure `src/lib/prisma.ts` imports correctly
- Create the prisma helper file if it doesn't exist with the proper import based on your Prisma setup

Documentation:

- https://www.better-auth.com/docs/integrations/next
- https://www.better-auth.com/docs/plugins/email-otp
- https://github.com/resend/resend-node

## Step 4 - Generate Prisma Schema with Better Auth CLI

**CRITICAL**: Use Better Auth CLI to automatically generate the Prisma schema based on your auth configuration:

`npx @better-auth/cli generate --config src/lib/auth.ts`

This command will:

- Read your Better Auth configuration from `src/lib/auth.ts`
- Automatically generate User, Session, and Verification models in `prisma/schema.prisma`
- Include all necessary fields for email OTP authentication

Then run the migration to apply the schema to your database:

`npx prisma migrate dev --name add_better_auth`
`npx prisma generate`

**DO NOT manually create the Prisma schema** - the CLI handles this automatically and ensures compatibility with your Better Auth plugins.

Documentation:

- https://www.better-auth.com/docs/adapters/prisma
- https://www.better-auth.com/docs/concepts/cli

## Step 5 - Create API Route Handler

Create `app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
```

This handles all Better Auth API endpoints.

Documentation: https://www.better-auth.com/docs/integrations/next

## Step 6 - Create Auth Client

Create `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, useSession } = authClient;
```

Add to `.env.local`:

```
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

Documentation: https://www.better-auth.com/docs/integrations/next

## Step 7 - Install Required shadcn/ui Components

Install all components needed for auth UI:

`npx shadcn@latest add input label card button tabs input-otp`

Documentation: https://ui.shadcn.com/docs/components/input-otp

## Step 8 - Get Reference Components (Helper)

**IMPORTANT**: We'll use high-quality shadcn components as reference, then adapt them to our needs.

Install reference components:

```bash
pnpm dlx shadcn@latest add https://coss.com/origin/r/comp-326.json
pnpm dlx shadcn@latest add https://coss.com/origin/r/comp-324.json
```

These install:

- `comp-326.json` - Sign in page reference
- `comp-324.json` - OTP code page reference

**Workflow**:

1. Install both components
2. Read and study the code patterns
3. Note the UI structure, validation, and user experience patterns
4. Delete these components (we'll create our own versions)
5. Use the learned patterns to build our custom sign-in and OTP pages

**DO NOT use these components directly** - they're just reference. We need to adapt them for Better Auth Email OTP.

## Step 9 - Create Sign In Page

**IMPORTANT**: Use the patterns from the reference components (Step 8) you just studied. Adapt them for Better Auth Email OTP.

Create `app/sign-in/page.tsx` with a two-step authentication flow:

**Step 1 - Email Input**:

- Use patterns from comp-326 reference (clean form layout)
- Email input field with proper validation
- "Send Code" button that triggers OTP email
- Loading states during API call
- Error handling with `text-destructive` color

**Step 2 - OTP Verification**:

- Use patterns from comp-324 reference (OTP input layout)
- shadcn/ui `InputOTP` component with 6 slots (install with `input-otp`)
- Display which email the code was sent to
- Auto-submit when all 6 digits are entered (`onComplete` handler)
- Option to go back and change email
- Clear error handling for invalid codes

**UI Requirements (from reference patterns)**:

- Beautiful centered layout with Card component
- Smooth transition between steps (conditional rendering)
- ONLY shadcn/ui theme colors (no custom colors)
- Mobile responsive design
- Professional spacing and typography

**Better Auth Integration**:

```typescript
// Send OTP (Step 1)
await authClient.emailOtp.sendVerificationOtp({
  email,
  type: "sign-in",
});

// Verify OTP and sign in (Step 2)
await authClient.signIn.emailOtp({
  email,
  otp,
});
```

After successful verification, redirect to `/account`.

**After creating the page, delete the reference components** from Step 8 - you don't need them anymore.

## Step 10 - Create Account Page

Create `app/account/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authClient.updateUser({
        name,
      });
      setMessage("Name updated successfully");
    } catch (err) {
      setMessage("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account</h1>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateName} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={session.user.email || ""}
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  {message && (
                    <p className="text-sm text-muted-foreground">{message}</p>
                  )}
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Authentication Method</h4>
                    <p className="text-sm text-muted-foreground">
                      Email OTP (One-Time Password)
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Account Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Email Verified: {session.user.emailVerified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

This creates a comprehensive account page with tabs for profile and security settings.

## Step 11 - Add Session Provider to Layout

Update `app/layout.tsx` to wrap with Better Auth session provider:

Add this import and update the Providers component in `app/providers.tsx`:

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

Better Auth session is handled automatically by the `useSession` hook from the auth client.

## Step 12 - Update Home Page with Auth Status

Update `app/page.tsx` to show auth status and navigation:

```typescript
"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { data: session, isPending } = useSession();

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Better Auth</CardTitle>
          <CardDescription>
            Authentication with Email OTP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPending ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : session ? (
            <div className="space-y-4">
              <p className="text-sm">
                Signed in as: <span className="font-medium">{session.user.email}</span>
              </p>
              <Button asChild className="w-full">
                <Link href="/account">Go to Account</Link>
              </Button>
            </div>
          ) : (
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
```

## Step 13 - Test Authentication Flow

**MANDATORY TESTING**: Verify the complete flow works:

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/sign-in
3. Enter an email address
4. Check email for OTP code
5. Enter OTP code
6. Verify redirect to /account
7. Test updating name
8. Test sign out

If any step fails, debug and fix before marking setup complete.

Setup completed - the project now has production-ready authentication with Email OTP, beautiful shadcn/ui pages, and full account management.
