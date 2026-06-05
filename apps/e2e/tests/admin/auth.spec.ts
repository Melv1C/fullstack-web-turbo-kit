import { expect, test } from "@playwright/test";

import { ENV } from "@/helpers/env";

import {
  applyAdminSession,
  createAdminSession,
  createNonAdminSession,
  getAdminCookies,
} from "../helpers/admin-auth";

test("Admin can log in", async ({ page }) => {
  await page.goto(ENV.ADMIN_URL);
  await expect(page).toHaveURL(/\/login$/);

  const session = await createAdminSession();

  try {
    const cookies = await getAdminCookies(session.userId);
    await page.context().addCookies(cookies);
    await page.reload();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Backend Status")).toBeVisible();
    await expect(page.getByText("Online")).toBeVisible();
  } finally {
    await session.cleanup();
  }
});

test("Unauthenticated users are redirected to login", async ({ page }) => {
  await page.goto(ENV.ADMIN_URL);
  await expect(page).toHaveURL(/\/login$/);
});

test("Non-admin users cannot access admin panel", async ({ page }) => {
  await page.goto(ENV.ADMIN_URL);
  await expect(page).toHaveURL(/\/login$/);

  const session = await createNonAdminSession("user");

  try {
    const cookies = await getAdminCookies(session.userId);
    await page.context().addCookies(cookies);
    await page.reload();

    await expect(page).toHaveURL(/\/unauthorized$/);
  } finally {
    await session.cleanup();
  }
});

test("Admin session fixture reaches the dashboard", async ({ page }) => {
  const session = await createAdminSession();

  try {
    await applyAdminSession(page.context(), session);
    await page.goto(ENV.ADMIN_URL);

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Quick Actions")).toBeVisible();
  } finally {
    await session.cleanup();
  }
});
