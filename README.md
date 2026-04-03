# Fullstack Turbo Kit Trigger

A production-ready [Turborepo](https://turbo.build/repo) monorepo starter with full-stack applications and shared packages.

## What's Inside?

### Apps

- **backend** — [Hono](https://hono.dev/) API server
- **frontend** — [Vite](https://vitejs.dev/) + [React](https://react.dev/) application
- **admin** — Vite + React admin application

### Packages

- **@repo/utils** — Shared utility functions and constants
- **@repo/typescript-config** — TypeScript configurations
- **@repo/ui** — Shared UI components and design system

All packages and apps are written in [TypeScript](https://www.typescriptlang.org/).

## Getting Started

Install dependencies:

```bash
bun install
```

Check that your environment variables are set up correctly by running:

```bash
bun run env:validate
```

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
