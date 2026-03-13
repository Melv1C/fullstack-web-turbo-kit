A Turborepo monorepo with a Hono backend API, two React+Vite frontends (user and admin) plus shared packages for UI, utils, and API client.

## Stack

- **Packager**: pnpm
- **Monorepo**: Turborepo
- **Backend**: Hono + Node, Prisma (PostgreSQL), better-auth
- **Frontend/Admin**: React 19, Vite, TanStack Router, TanStack Query
- **UI**: Tailwind CSS 4, @melv1c/ui-core
- **Linting**: Oxlint, Oxfmt
- **Type system**: TypeScript (strict mode)
- **Database**: PostgreSQL (via Docker)

### Features-Based Organization

React apps use a features-based folder structure, grouping related components, hooks, and utilities by feature.

```
src/
  features/
    feature/
      components/       # React components
      hooks/            # React hooks
      utils/            # Utility functions and helpers
      feature-store.ts  # Zustand store for the feature (if needed)
      index.ts          # Exports components, hooks, utils for outer use
```

## Scripts

- `pnpm run build` - Build all packages
- `pnpm lint` - Run Oxlint on all packages
- `pnpm format` - Run Oxfmt on all packages
- `pnpm run prisma:generate` - Generate Prisma client
- `pnpm run prisma:migrate` - Run Prisma migrations
- `pnpm run prisma:format` - Format Prisma schema

Assume that the development environment is already running. Do not execute any `pnpm dev` commands, and proceed as if the applications are directly accessible in the browser.

Backend runs on port 3000, frontend on 5173, admin on 5174.
