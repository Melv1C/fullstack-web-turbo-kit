FROM node:22-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ---
FROM base AS prepare
RUN pnpm install -g turbo@^2
COPY . .
# Prune the monorepo for the admin app
RUN turbo prune admin --docker

# ---
FROM base AS installer
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
# Remove package-lock.json to avoid conflicts
RUN rm -f package-lock.json
# Install dependencies
RUN pnpm i

# ---
FROM base AS builder
# Copy dependencies
COPY --from=installer /app/ .
# Copy source files
COPY --from=prepare /app/out/full/ .

ARG APP_ENV=production

# Build the admin app
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
RUN pnpm run prisma:generate
RUN pnpm run build:${APP_ENV} --filter=admin

# ---
FROM nginx:alpine AS runner
# Copy built static files to nginx
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

# Copy runtime env script and make it executable
# This script runs on container startup to replace MY_APP_* placeholders
COPY apps/admin/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Copy runtime env script and make it executable
# This script runs on container startup to replace MY_APP_* placeholders
COPY apps/admin/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
