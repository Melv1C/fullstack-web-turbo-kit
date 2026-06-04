import { expect, test } from "@playwright/test";
import { ENV } from "@/helpers/env";

test("frontend home shows backend health", async ({ page }) => {
  await page.goto(ENV.FRONTEND_URL);
  await expect(page.getByRole("heading", { name: "Welcome to fullstack-web-" })).toBeVisible();
  await expect(page.getByText("Backend Status")).toBeVisible();
  await expect(page.getByText("Online")).toBeVisible();
});
