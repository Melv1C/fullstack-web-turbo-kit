FROM oven/bun:1 AS base
WORKDIR /app

# ---
FROM base AS prepare
RUN bun install -g turbo@^2
COPY . .
# Prune the monorepo for the backend app
RUN turbo prune backend --docker

# ---
FROM base AS installer
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
# Remove package-lock.json to avoid conflicts
RUN rm -f package-lock.json
# Install dependencies
RUN bun i

# ---
FROM base AS builder
# Copy dependencies
COPY --from=installer /app/ .
# Copy source files
COPY --from=prepare /app/out/full/ .
# Ensure shared env schema is available for varlock imports
COPY .env.shared ./.env.shared

# Build backend
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
RUN bun run prisma:generate
RUN bun run build --filter=backend

# ---
FROM base AS runner
# Don't run production as root
RUN groupadd --system --gid 1001 group && useradd --system --uid 1001 --gid group user
USER user

WORKDIR /app

# Copy built application
COPY --from=builder --chown=user:group /app .

CMD ["bun", "--filter", "backend", "start"]
