# Fullstack Turbo Kit

A production-ready [Turborepo](https://turbo.build/repo) monorepo starter with full-stack applications and shared packages.

## What's Inside?

### Apps

- **backend** — [Hono](https://hono.dev/) API server
- **frontend** — [Vite](https://vitejs.dev/) + [React](https://react.dev/) application
- **admin** — Vite + React admin application
- **desktop** — [Electron](https://www.electronjs.org/) desktop application
- **mobile** — [Expo](https://expo.dev/) React Native application

### Packages

- **@repo/api-client** — Shared API client for frontend-backend communication
- **@repo/utils** — Shared utility functions and constants
- **@repo/typescript-config** — TypeScript configurations
- **@repo/ui** — Shared UI components and design system

All packages and apps are written in [TypeScript](https://www.typescriptlang.org/).

## Getting Started

Install dependencies:

```bash
pnpm install
```

Copy the example environment variables:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/desktop/.env.example apps/desktop/.env
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
pnpm --filter frontend run build:staging
pnpm --filter frontend run build:production
pnpm --filter admin run build:staging
pnpm --filter admin run build:production
```

Only backend env values are sensitive (for example: `DATABASE_URL`, `BETTER_AUTH_SECRET`) and must never be committed.

Start the development database (PostgreSQL):

```bash
pnpm run docker:db
```

Migrate the database:

```bash
pnpm run prisma:migrate
```

Generate the prisma client:

```bash
pnpm run prisma:generate
```

Run all apps in development mode:

```bash
pnpm run dev
```

Run desktop or mobile individually:

```bash
pnpm run dev:desktop
pnpm run dev:mobile
```
