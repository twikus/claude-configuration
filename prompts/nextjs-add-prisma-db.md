# Prisma Database Setup

You are a senior backend developer with 8+ years experience in database design and Prisma ORM implementation.

Setup Prisma in the current Next.js project with a basic database schema tailored to the application type. Execute all steps without user intervention.

This is a one-shot setup for production-ready Prisma configuration with TypeScript, basic schema, and seed data.

## Workflow Instructions - IMPORTANT

**CRITICAL**: Follow these workflow rules throughout the entire setup:

**Flexibility and Adaptation:**

- ALWAYS inspect the existing codebase structure before starting
- Adapt paths and configurations to match the actual project structure
- If the project uses a different directory structure (e.g., no `src/` folder, different component paths), adjust accordingly
- Read `tsconfig.json` to understand the path aliases configuration
- Check existing files to understand the current architecture before making changes
- Don't force a specific structure - work with what exists

**Before coding any step:**

- Read the documentation links provided
- Use Context7 to gather additional information when needed
- Understand the patterns before implementing

**CRITICAL DATABASE RULES:**

- NO authentication tables (no User, Account, Session, VerificationToken)
- NO user-related fields or relations
- Create only ONE simple table to verify Prisma configuration works
- Keep it minimal and focused on testing the setup

**After completing all setup steps:**

- Run `pnpm prisma generate` to verify schema is valid
- Run `pnpm prisma migrate dev` to verify migrations work
- Run `pnpm prisma db seed` to verify seed data works
- Add Prisma scripts to `package.json` if not present
- Fix any errors before considering the setup complete

**Documentation requirements:**

- Update `CLAUDE.md` with Prisma configuration and database schema information
- Document database provider choice and reasoning

These steps are NOT optional - they ensure database quality and proper setup from day one.

## Step 0 - Default Table Setup

**MANDATORY FIRST STEP**: Ask the user if they want to create a default test table to verify the Prisma configuration works.

If yes, ask them to either:

1. Provide the table name and structure (fields, types)
2. OR explain what the table represents and you'll design it

**IMPORTANT**: Only ONE table is needed at this stage to verify configuration works. Keep it simple.

Example: A basic "Post" table with id, title, content, createdAt fields.

Wait for user response before proceeding to Step 1.

## Step 1 - Install Prisma

Install Prisma dependencies:

`npm install prisma @prisma/client`
`npx prisma init`

This creates `prisma/schema.prisma` and `.env` files.

Documentation: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql

## Step 2 - Configure Database Provider

Update `prisma/schema.prisma` with appropriate database provider based on project needs:

- PostgreSQL (default, production-ready)

Update `.env` with appropriate DATABASE_URL for the chosen provider.

Documentation: https://www.prisma.io/docs/orm/reference/prisma-schema-reference#datasource

## Step 3 - Create Basic Schema

Create ONE simple table based on what the user specified in Step 0 to verify Prisma configuration works.

**IMPORTANT**: Adapt to the existing project structure:

- If the project has a `src/` folder, use output: `"../src/generated/client"`
- If no `src/` folder exists, use output: `"../generated/client"`
- Check the directory structure before deciding the path

Update `prisma/schema.prisma` to:

1. Configure custom output path for generated client (adapt based on structure)
2. Add the model based on user requirements

**FORBIDDEN**:

- User, Account, Session, VerificationToken tables
- Any authentication-related fields
- userId or similar user reference fields

**REQUIRED**:

- Set generator output path matching project structure
- Proper field types (String, Int, DateTime, Boolean, etc.)
- Sensible default values where appropriate
- createdAt and updatedAt timestamps
- Descriptive model name in PascalCase
- Keep it simple - just one table at this stage

**Example for project with `src/` folder:**

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Example for project without `src/` folder:**

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/client"
}
// ... rest same
```

Documentation: https://www.prisma.io/docs/orm/prisma-schema/data-model/models

## Step 4 - Exclude Generated Folder from Checks

Configure linter and TypeScript to ignore the generated Prisma client.

**IMPORTANT**: Check the existing project structure first:

- Read `tsconfig.json` to see current paths and structure
- If there's no `src/` folder, adjust paths accordingly
- Match the existing architecture (e.g., if components are in root, use `generated/` instead of `src/generated/`)

**Update `.eslintignore`** (create if it doesn't exist):

```
src/generated/
```

**Update `tsconfig.json`** to exclude generated folder (adapt path if needed):

```json
{
  "exclude": ["node_modules", "src/generated"]
}
```

This ensures:

- ESLint doesn't lint generated code
- TypeScript doesn't check generated files during `tsc --noEmit`
- Faster builds and checks

## Step 5 - Create Prisma Client Helper

**IMPORTANT**: Check the existing project structure:

- Read `tsconfig.json` to understand path aliases (e.g., `@/*` mapping)
- Verify where utilities/libs are stored (could be `lib/`, `src/lib/`, or elsewhere)
- Adapt the import path and file location to match the project structure

Create the Prisma client helper with PrismaClient singleton pattern for Next.js.

**Example for project with `src/` folder** (`src/lib/prisma.ts`):

```typescript
import { PrismaClient } from "@/generated/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Example for project without `src/` folder** (`lib/prisma.ts`):

```typescript
import { PrismaClient } from "@/generated/client";
// ... same code
```

**IMPORTANT**:

- Import from `@/generated/client` (adapt alias if different in tsconfig.json)
- Adjust file location to match existing `lib` or `utils` structure
- Update the schema generator output path accordingly

This prevents multiple PrismaClient instances in development hot reload.

Documentation: https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

## Step 6 - Create Prisma Config

Create `prisma.config.ts` in the project root with complete Prisma configuration using the new approach:

```typescript
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: `tsx prisma/seed.ts`,
  },
});
```

This configuration:

- Specifies the schema location explicitly
- Defines the seed command using tsx
- Works one-shot without additional configuration

Install tsx if needed: `npm install -D tsx`

This replaces the old package.json seed approach and is the recommended way to configure Prisma.

Documentation: https://www.prisma.io/docs/orm/reference/prisma-config-reference

## Step 7 - Create Seed Script

Create `prisma/seed.ts` with realistic placeholder data for the table (5-10 records).

Data should be:

- Realistic and representative of actual use cases
- Include both basic and edge cases
- Use prisma client to insert data

Example structure:

```typescript
import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

async function main() {
  // Create seed data here
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**IMPORTANT**: Import from `../src/generated/client` (relative path from `prisma/seed.ts`).

Documentation: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

## Step 8 - Create First Migration

Run initial migration:

`npx prisma migrate dev --name init`

This creates the migration files and applies them to the database.

Documentation: https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production

## Step 9 - Seed Database

Run seed script to populate database:

`npx prisma db seed`

Verify data was created by running:

`npx prisma studio`

This opens a browser interface to view database contents.

## Step 10 - Add Prisma Scripts

Ensure `package.json` has these scripts:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed"
  }
}
```

## Step 11 - Create Example API Route

Create `app/api/example/route.ts` that demonstrates:

- Importing prisma from `@/lib/prisma`
- A GET endpoint that fetches all records from the table
- A POST endpoint that creates a new record
- Proper error handling
- TypeScript types from Prisma

This validates the entire setup works end-to-end.

Documentation: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

Setup completed - the project is ready with Prisma, database schema, seed data, and example API routes.
