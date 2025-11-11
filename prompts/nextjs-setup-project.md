# Next.js Complete Setup

You are a senior Next.js developer with 8+ years experience in rapid project setup and production-ready applications.

Setup a complete Next.js project in the current directory with TypeScript, Tailwind, shadcn/ui, TanStack Query, and theme support. Execute all steps without user intervention.

This is a one-shot setup for a production-ready Next.js app with App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, and dark/light theme toggle.

## Workflow Instructions - IMPORTANT

**CRITICAL**: Follow these workflow rules throughout the entire setup:

**Flexibility and Adaptation:**

- If the project already exists with a different structure, adapt to it
- Check existing `tsconfig.json` for path alias configuration
- Don't overwrite existing setup without understanding it first
- Respect existing directory structures and conventions

**Before coding any step:**

- Read the documentation links provided
- Use Context7 to gather additional information when needed
- Understand the patterns before implementing

**After completing all setup steps:**

- Add quality check scripts to `package.json`: `"lint": "eslint ."` and `"ts": "tsc --noEmit"`
- Run `pnpm lint` to verify linting passes
- Run `pnpm ts` to verify TypeScript checks pass
- Fix any errors before considering the setup complete

**Documentation requirements:**

- Create `CLAUDE.md` in the project root with all important stack information (Next.js version, dependencies, configuration choices, folder structure)
- Add dialog manager usage instructions to `CLAUDE.md`:
  - Always use the dialog manager from UI.NOWTS for dialogs
  - Never create manual dialog components when dialog manager is available
  - Documentation: https://ui.nowts.app/ui/dialog-manager
- Create `AGENTS.md` as a symlink to `CLAUDE.md` for agent reference

These steps are NOT optional - they ensure code quality and proper documentation from day one.

## Step 1 - Install Next.js

Run this command to create the Next.js project with all necessary arguments:

`npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes`

**IMPORTANT**: Use `--no-src-dir` to keep the `app` folder at the root for Next.js routing.

Documentation: https://nextjs.org/docs/app/api-reference/cli/create-next-app

## Step 2 - Create src directory and configure path aliases

Create the `src` directory for components and utilities:

`mkdir -p src/components src/lib`

Update `tsconfig.json` to map `@/*` to `./src/*`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Directory structure:**

- `/app` - Next.js App Router (pages, layouts, routing)
- `/src/components` - All components including shadcn/ui
- `/src/lib` - Utilities and helper functions

This ensures:

- `@/components` maps to `src/components`
- `@/lib/utils` maps to `src/lib/utils`
- App Router stays at the root for clean routing

## Step 3 - Clean default files

Remove default content from `app/page.tsx` and replace with a simple paragraph "Next.js setup complete" in a centered main tag.

## Step 4 - Install TanStack Query

Install the package: `npm install @tanstack/react-query`

Create `app/providers.tsx` with a client component that exports Providers. This component should create a QueryClient in useState with staleTime of 60 seconds, then wrap children with QueryClientProvider.

Wrap the children in `app/layout.tsx` with this Providers component.

Documentation: https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider

## Step 5 - Install shadcn/ui and theme

Initialize shadcn/ui with custom src directory configuration:

`npx shadcn@latest init`

**CRITICAL**: During the interactive prompts, configure these paths:

- Components: `@/components`
- Utils: `@/lib/utils`

This will create a `components.json` with the correct paths pointing to the `src` folder.

Add base components: `npx shadcn@latest add button input card`

This will install components to `src/components/ui/` and utilities to `src/lib/utils.ts`.

Install next-themes: `npm install next-themes`

Update `app/providers.tsx` to add ThemeProvider (from next-themes) around children with props: attribute="class", defaultTheme="system", enableSystem.

Create `src/components/theme-toggle.tsx` that uses useTheme from next-themes to create a button that toggles between dark and light. Use the Button component from shadcn/ui. Remember to handle mounted state to avoid hydration errors.

Documentation: https://ui.shadcn.com/docs/dark-mode/next

## Step 6 - Install UI utilities

Install the dialog manager from UI.NOWTS for easy dialog handling:

`pnpm dlx shadcn@latest add https://ui.nowts.app/r/dialog-manager.json`

Install server toast for server-side notifications:

`pnpm dlx shadcn@latest add https://ui.nowts.app/r/server-toast.json`

**Setup in app/layout.tsx:**

Add both the DialogManagerRenderer and ServerToaster to your root layout:

```tsx
import { DialogManagerRenderer } from "@/lib/dialog-manager/dialog-manager-renderer";
import { ServerToaster } from "@/components/server-toast/server-toast.server";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <DialogManagerRenderer />
        <Suspense>
          <ServerToaster />
        </Suspense>
      </body>
    </html>
  );
}
```

**Update CLAUDE.md** to add a "UI Utilities" section with:

```markdown
## UI Utilities

### Dialog Manager

Always use the dialog manager from UI.NOWTS for dialogs instead of creating manual dialog components.

- Documentation: https://ui.nowts.app/ui/dialog-manager
- Location: `@/lib/dialog-manager/dialog-manager`
- Usage: Import `dialogManager` from the lib and use methods like `confirm()`, `input()`, or `custom()`
- Example: `dialogManager.confirm({ title: "Delete?", description: "Are you sure?", action: { label: "Delete", onClick: async () => { await deleteItem() } } })`

### Server Toast

Use server toast for server-side notifications and feedback from server actions.

- Documentation: https://ui.nowts.app/ui/server-toast
- Location: `@/components/server-toast`
- Usage: Import `serverToast` function in server actions: `await serverToast("Success!", "success")`
- Types: success, error, warning, info
- Persists across redirects using cookies
```

## Step 7 - Example page

Update `app/page.tsx` to display:

- A title "Next.js Setup Complete"
- The ThemeToggle component from `@/components/theme-toggle`
- A Card with an Input and Button inside to demonstrate everything works

Use shadcn/ui components: Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle.

All imports should use the `@/` alias:

- `import { Button } from "@/components/ui/button"`
- `import { ThemeToggle } from "@/components/theme-toggle"`

All elements should be centered on the page.

## Step 8 - Add default landing page with navbar

Install the navbar component from coss.com:

`pnpm dlx shadcn@latest add https://coss.com/origin/r/comp-577.json`

**IMPORTANT**: After installation, rename the component file and component name to something meaningful (e.g., `navbar.tsx` and `Navbar`).

Install landing page sections from shadcn-ui-blocks:

```bash
npx shadcn add https://shadcn-ui-blocks.akashmoradiya.com/r/hero-03.json
npx shadcn add https://shadcn-ui-blocks.akashmoradiya.com/r/footer-05.json
npx shadcn add https://shadcn-ui-blocks.akashmoradiya.com/r/faq-02.json
```

**IMPORTANT**: After installation, move the hero, footer, and FAQ components to `src/features/landing/` directory:

- Create the directory: `mkdir -p src/features/landing`
- Move components: `mv src/components/{hero-03,footer-05,faq-02}.tsx src/features/landing/`
- Rename components to more semantic names: `hero.tsx`, `footer.tsx`, `faq.tsx`
- Update component names inside the files to match

**Update CLAUDE.md** to add a "Project Structure" section with:

```markdown
## Project Structure

### Features Organization

Components are organized by feature in `src/features/`:

- `src/features/landing/` - Landing page components (hero, footer, FAQ)

Use the `@/` alias to import: `import { Hero } from "@/features/landing/hero"`
```

Create a complete landing page in `app/page.tsx` with:

- Navbar at the top with:
  - Logo/brand name
  - Link to `/signin` route
  - Theme toggle button (mode toggle)
- Hero section (from hero-03)
- FAQ section (from faq-02)
- Footer section (from footer-05)

The navbar should be persistent across pages, so add it to `app/layout.tsx` or create a separate layout component.

Setup completed - the project is ready with:

- `/app` for Next.js routing
- `/src` for components and utilities
- TanStack Query, shadcn/ui, and theme support
- Navbar with authentication link and theme toggle
- Dialog manager for easy dialog handling
