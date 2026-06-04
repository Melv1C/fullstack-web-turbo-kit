import type { BrowserContext, Page } from "@playwright/test";

import { ENV } from "./env";
import { auth } from "./test-runtime";

export type AdminSession = {
  userId: string;
  cleanup: () => Promise<void>;
};

export async function createAdminSession(): Promise<AdminSession> {
  const ctx = await auth.$context;
  const testHelpers = ctx.test;
  const user = await testHelpers.saveUser(
    testHelpers.createUser({
      role: "admin",
    }),
  );

  return {
    userId: user.id,
    cleanup: async () => {
      await testHelpers.deleteUser(user.id);
    },
  };
}

export async function getAdminCookies(userId: string) {
  const ctx = await auth.$context;
  const testHelpers = ctx.test;

  return testHelpers.getCookies({
    userId,
    domain: new URL(ENV.ADMIN_URL).hostname,
  });
}

export function formatCookieHeader(cookies: Awaited<ReturnType<typeof getAdminCookies>>) {
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

export async function applyAdminSession(context: BrowserContext, session: AdminSession) {
  const cookies = await getAdminCookies(session.userId);
  await context.addCookies(cookies);
}

export async function loginAsAdmin(page: Page): Promise<AdminSession> {
  const session = await createAdminSession();
  await applyAdminSession(page.context(), session);
  await page.goto(ENV.ADMIN_URL);
  return session;
}

export async function createNonAdminSession(role: "user" = "user"): Promise<AdminSession> {
  const ctx = await auth.$context;
  const testHelpers = ctx.test;
  const user = await testHelpers.saveUser(
    testHelpers.createUser({
      role,
    }),
  );

  return {
    userId: user.id,
    cleanup: async () => {
      await testHelpers.deleteUser(user.id);
    },
  };
}
