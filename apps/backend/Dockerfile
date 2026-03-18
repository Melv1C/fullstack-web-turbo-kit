FROM oven/bun:1 AS base
WORKDIR /app

# ---
FROM base AS prepare
COPY . .
# Prune the monorepo for the backend app
RUN bunx turbo prune backend --docker

# ---
FROM base AS installer
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
# Install dependencies
RUN bun install --frozen-lockfile

# ---
FROM base AS builder
# Copy dependencies
COPY --from=installer /app/node_modules ./node_modules
# Copy package manifests for runtime commands
COPY --from=installer /app/package.json /app/bun.lock ./
# Copy source files
COPY --from=prepare /app/out/full/ .
# Ensure shared env schema is available for varlock imports
COPY .env.shared ./.env.shared

# Generate Prisma client
RUN bun run prisma:generate

# ---
FROM base AS runner
# Don't run production as root
RUN groupadd --system --gid 1001 group && useradd --system --uid 1001 --gid group user
RUN mkdir -p /home/user/.config && chown -R user:group /home/user
ENV HOME=/home/user
USER user

WORKDIR /app

# Copy built application
COPY --from=builder --chown=user:group /app .

CMD ["bun", "--filter", "backend", "start"]
