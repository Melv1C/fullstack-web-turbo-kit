import { test as base } from "@playwright/test";

import { applyAdminSession, createAdminSession, type AdminSession } from "../helpers/admin-auth";

export const adminTest = base.extend<{ adminSession: AdminSession }>({
  adminSession: [
    async ({ context }, use) => {
      const session = await createAdminSession();
      await applyAdminSession(context, session);

      try {
        await use(session);
      } finally {
        await session.cleanup();
      }
    },
    { auto: true },
  ],
});
