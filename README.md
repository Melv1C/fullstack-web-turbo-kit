# Fullstack Turbo Kit

A production-ready [Turborepo](https://turbo.build/repo) monorepo starter with full-stack applications and shared packages.

## What's Inside?

### Apps

- **backend** — [Hono](https://hono.dev/) API server
- **frontend** — [Vite](https://vitejs.dev/) + [React](https://react.dev/) application
- **admin** — Vite + React admin application

### Packages

- **@repo/api-client** — Shared API client for frontend-backend communication
- **@repo/utils** — Shared utility functions and constants
- **@repo/typescript-config** — TypeScript configurations
- **@repo/ui** — Shared UI components and design system

All packages and apps are written in [TypeScript](https://www.typescriptlang.org/).

## Getting Started

Install dependencies:

```bash
bun install
```

Copy the example environment variables:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Varlock manages env schema/validation and derived values:

- Shared defaults live in `.env.shared`, and each app defines an `.env.schema` that imports it.
- `APP_ENV` controls which derived defaults and required values apply (default: `local`).
- For staging/production, set `STAGING_*` or `PROD_*` URLs as real environment variables (defaults are `MY_APP_*` placeholders for the Docker runtime replacement scripts).
- Frontend/admin no longer use `.env.*` files; values are derived via schema.
- To validate and inspect resolved envs, run `bun exec varlock load` from the app directory.
- For CLI tools that need injected env vars, use `bun exec varlock run -- <command>`.

Use explicit `APP_ENV` modes for web apps:

```bash
bun --filter frontend build:staging
bun --filter frontend build:production
bun --filter admin build:staging
bun --filter admin build:production
```

Only backend env values are sensitive (for example: `DATABASE_URL`, `BETTER_AUTH_SECRET`) and must never be committed.

Start the development database (PostgreSQL):

```bash
bun run docker:db
```

Migrate the database:

```bash
bun run prisma:migrate
```

Generate the prisma client:

```bash
bun run prisma:generate
```

Run all apps in development mode:

```bash
bun run dev
```
