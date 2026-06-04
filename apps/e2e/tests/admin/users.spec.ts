import { expect } from "@playwright/test";
import { ENV } from "@/helpers/env";

import { adminTest } from "../fixtures/admin-test";
import { deleteUserByEmail } from "../helpers/seed";

adminTest.describe("Admin user management", () => {
  adminTest("lists users and opens user details", async ({ page }) => {
    await page.goto(`${ENV.ADMIN_URL}/users`);

    await expect(page.getByText("Manage your application users")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create User" })).toBeVisible();
    await expect(page.getByText("Loading users...")).toBeHidden({ timeout: 15000 });

    const row = page.getByRole("row").nth(1);
    await expect(row).toBeVisible();

    await row.locator('[aria-haspopup="menu"]').click();
    await page.getByRole("menuitem", { name: "View Details" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("User Details")).toBeVisible();
  });

  adminTest("creates a user and finds them via search", async ({ page }) => {
    const unique = Date.now();
    const name = `E2E User ${unique}`;
    const email = `e2e-user-${unique}@example.com`;
    const password = "password1234";

    try {
      await page.goto(`${ENV.ADMIN_URL}/users`);
      await page.getByRole("button", { name: "Create User" }).click();

      await expect(page.getByRole("heading", { name: "Create New User" })).toBeVisible();
      await page.getByLabel("Name").fill(name);
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill(password);
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Create User", exact: true })
        .click();

      await expect(page.getByRole("heading", { name: "Create New User" })).toBeHidden({
        timeout: 15000,
      });

      await page.getByPlaceholder(/Search by email/).fill(email);
      await page.getByPlaceholder(/Search by email/).press("Enter");

      await expect(page.getByText(name)).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(email)).toBeVisible();
    } finally {
      await deleteUserByEmail(email);
    }
  });

  adminTest("filters users by role", async ({ page }) => {
    await page.goto(`${ENV.ADMIN_URL}/users`);

    const roleFilter = page.getByText("Role", { exact: true }).locator("..").getByRole("combobox");
    await roleFilter.click();
    await page.getByRole("option", { name: "Admin" }).click();

    await expect(page.getByText("Manage your application users")).toBeVisible();
    await expect(page.getByText("admin", { exact: false }).first()).toBeVisible({ timeout: 15000 });
  });
});
