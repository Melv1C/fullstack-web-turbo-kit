import { createAuth } from "@repo/auth";
import { ENV } from "varlock/env";

import { prismaWithoutLog } from "@/lib/prisma";

export const auth = createAuth({
  prisma: prismaWithoutLog,
  secret: ENV.BETTER_AUTH_SECRET,
  baseURL: ENV.BACKEND_URL,
  trustedOrigins: [ENV.FRONTEND_URL, ENV.ADMIN_URL],
});
