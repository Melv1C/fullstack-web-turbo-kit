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

Frontend and admin environment profiles are versioned in Git and are intentionally public:

- `apps/frontend/.env.local`
- `apps/frontend/.env.staging`
- `apps/frontend/.env.production`
- `apps/admin/.env.local`
- `apps/admin/.env.staging`
- `apps/admin/.env.production`

Use explicit build modes for web apps:

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
