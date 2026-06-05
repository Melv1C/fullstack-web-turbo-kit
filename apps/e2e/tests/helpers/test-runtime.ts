import { createAuth } from "@repo/auth";
import { createPrismaClient } from "@repo/database";

import { ENV } from "./env";

const { prismaWithoutLog } = createPrismaClient({
  connectionString: ENV.DATABASE_URL,
  reuseGlobal: true,
});

export const auth = createAuth({
  prisma: prismaWithoutLog,
  secret: ENV.BETTER_AUTH_SECRET,
  baseURL: ENV.BACKEND_URL,
  trustedOrigins: [ENV.FRONTEND_URL, ENV.ADMIN_URL],
  hasTestUtils: true,
});

export { prismaWithoutLog };
