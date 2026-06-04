import { expect } from "@playwright/test";

import { ENV } from "@/helpers/env";

import { adminTest } from "../fixtures/admin-test";
import { breadcrumb } from "../helpers/locators";

adminTest.describe("Admin Prisma Studio", () => {
  adminTest("loads prisma studio for authenticated admins", async ({ page }) => {
    const studioResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/api/studio") && response.request().method() === "POST",
      { timeout: 30000 },
    );

    await page.goto(`${ENV.ADMIN_URL}/prisma-studio`);

    await expect(page).toHaveURL(/\/prisma-studio$/);
    await expect(breadcrumb(page, "Prisma Studio")).toBeVisible();

    const response = await studioResponse;
    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login$/);
  });
});
