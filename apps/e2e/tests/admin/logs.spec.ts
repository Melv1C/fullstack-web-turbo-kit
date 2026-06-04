import { expect } from "@playwright/test";

import { ENV } from "@/helpers/env";

import { adminTest } from "../fixtures/admin-test";
import { triggerAuthenticatedRequest } from "../helpers/seed";

const healthPath = "/api/health";
const healthLogMessage = `Request GET ${healthPath} completed`;

adminTest.describe("Admin log search", () => {
  adminTest("shows request logs and opens log details", async ({ page, adminSession }) => {
    const response = await triggerAuthenticatedRequest(page.context(), adminSession.userId);
    expect(response.ok()).toBe(true);

    await page.goto(`${ENV.ADMIN_URL}/logs`);
    await expect(page.getByText("Click on a row to view full details")).toBeVisible();
    await expect(page.getByText("Loading logs...")).toBeHidden({ timeout: 15000 });

    await expect(page.getByText(healthLogMessage).first()).toBeVisible({ timeout: 15000 });

    await page
      .getByRole("button", { name: new RegExp(`View details for log: ${healthLogMessage}`) })
      .first()
      .click();

    await expect(page.getByText("Log Details")).toBeVisible();
    await expect(page.getByText(healthPath).first()).toBeVisible();
  });

  adminTest("searches logs by path", async ({ page, adminSession }) => {
    await triggerAuthenticatedRequest(page.context(), adminSession.userId);

    await page.goto(`${ENV.ADMIN_URL}/logs`);
    await expect(page.getByText("Loading logs...")).toBeHidden({ timeout: 15000 });

    await page.getByLabel("Search").fill(healthPath);
    await page.getByLabel("Search").press("Enter");

    await expect(page.getByText(healthLogMessage).first()).toBeVisible({ timeout: 15000 });
  });

  adminTest("shows request log type badges", async ({ page, adminSession }) => {
    const response = await triggerAuthenticatedRequest(page.context(), adminSession.userId);
    expect(response.ok()).toBe(true);

    await page.goto(`${ENV.ADMIN_URL}/logs`);
    await expect(page.getByText("Loading logs...")).toBeHidden({ timeout: 15000 });

    const requestLogRow = page.getByRole("button").filter({ hasText: healthLogMessage }).first();
    await expect(requestLogRow).toBeVisible({ timeout: 15000 });
    await expect(requestLogRow.getByText("REQUEST", { exact: true })).toBeVisible();
  });
});
