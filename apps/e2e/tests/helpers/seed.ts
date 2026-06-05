import type { BrowserContext } from "@playwright/test";

import { formatCookieHeader, getAdminCookies } from "./admin-auth";
import { ENV } from "./env";
import { prismaWithoutLog } from "./test-runtime";

export async function deleteUserByEmail(email: string) {
  await prismaWithoutLog.user.deleteMany({
    where: { email },
  });
}

export async function triggerAuthenticatedRequest(
  context: BrowserContext,
  userId: string,
  path = "/api/health",
) {
  const cookies = await getAdminCookies(userId);
  const response = await context.request.get(`${ENV.BACKEND_URL}${path}`, {
    headers: {
      cookie: formatCookieHeader(cookies),
    },
  });

  return response;
}
