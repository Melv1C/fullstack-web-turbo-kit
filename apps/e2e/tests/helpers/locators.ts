import type { Page } from "@playwright/test";

export function sidebarLink(page: Page, name: string) {
  return page
    .locator('[data-sidebar="sidebar"]')
    .getByRole("link", { name, exact: true });
}

export function breadcrumb(page: Page, name: string) {
  return page.getByLabel("breadcrumb").getByText(name, { exact: true });
}
