import { expect } from "@playwright/test";
import { ENV } from "@/helpers/env";

import { adminTest } from "../fixtures/admin-test";
import { breadcrumb, sidebarLink } from "../helpers/locators";

const pages = [
  { link: "Dashboard", path: /\/$/, content: "Quick Actions", useBreadcrumb: false },
  { link: "Users", path: /\/users$/, content: "Manage your application users", useBreadcrumb: true },
  { link: "Logs", path: /\/logs$/, content: "Click on a row to view full details", useBreadcrumb: true },
  { link: "Cron", path: /\/cron$/, content: "Select a cron to inspect and trigger it", useBreadcrumb: true },
  { link: "Prisma Studio", path: /\/prisma-studio$/, content: "", useBreadcrumb: true },
] as const;

adminTest.describe("Admin navigation", () => {
  adminTest.beforeEach(async ({ page }) => {
    await page.goto(ENV.ADMIN_URL);
    await expect(page).toHaveURL(/\/$/);
  });

  for (const { link, path, content, useBreadcrumb } of pages) {
    adminTest(`sidebar navigates to ${link}`, async ({ page }) => {
      if (link !== "Dashboard") {
        await sidebarLink(page, link).click();
      }

      await expect(page).toHaveURL(path);

      if (useBreadcrumb) {
        await expect(breadcrumb(page, link)).toBeVisible();
      } else {
        await expect(page.getByText(content)).toBeVisible();
      }
    });
  }

  adminTest("dashboard quick actions link to admin sections", async ({ page }) => {
    await page.getByRole("link", { name: "Manage Users" }).click();
    await expect(page).toHaveURL(/\/users$/);
    await expect(page.getByText("Manage your application users")).toBeVisible();

    await page.goto(ENV.ADMIN_URL);
    await page.getByRole("link", { name: "View Logs" }).click();
    await expect(page).toHaveURL(/\/logs$/);

    await page.goto(ENV.ADMIN_URL);
    await page.getByRole("link", { name: /Browse and edit database/ }).click();
    await expect(page).toHaveURL(/\/prisma-studio$/);
  });
});
