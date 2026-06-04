import { expect } from "@playwright/test";
import { ENV } from "@/helpers/env";

import { adminTest } from "../fixtures/admin-test";

adminTest.describe("Admin cron jobs", () => {
  adminTest("lists cron jobs and opens log cleanup detail", async ({ page }) => {
    await page.goto(`${ENV.ADMIN_URL}/cron`);

    await expect(page.getByText("Cron jobs")).toBeVisible();
    await expect(page.getByText("Log cleanup")).toBeVisible();
    await expect(page.getByText("/api/cron/log-cleanup")).toBeVisible();

    await page.getByRole("link", { name: "Log cleanup" }).click();
    await expect(page).toHaveURL(/\/cron\/log-cleanup$/);

    await expect(page.getByRole("heading", { name: "Log cleanup" })).toBeVisible();
    await expect(page.getByLabel("Body")).toBeVisible();
    await expect(page.getByRole("button", { name: "Trigger" })).toBeVisible();
    await expect(page.getByText("Curl command")).toBeVisible();
    await expect(page.getByText("Route logs")).toBeVisible();
  });

  adminTest("triggers log cleanup cron as admin", async ({ page }) => {
    await page.goto(`${ENV.ADMIN_URL}/cron/log-cleanup`);

    await page.getByRole("button", { name: "Trigger" }).click();

    await expect(page.getByText(/Log cleanup completed|deleted \d+ logs/i)).toBeVisible({
      timeout: 15000,
    });
  });

  adminTest("navigates back to cron list from detail page", async ({ page }) => {
    await page.goto(`${ENV.ADMIN_URL}/cron/log-cleanup`);

    await page.getByRole("link", { name: "Cron jobs" }).click();
    await expect(page).toHaveURL(/\/cron$/);
    await expect(page.getByText("Select a cron to inspect and trigger it")).toBeVisible();
  });
});
