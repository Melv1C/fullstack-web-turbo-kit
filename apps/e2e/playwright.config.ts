import { defineConfig, devices } from "@playwright/test";
import "varlock/auto-load";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "docker compose -f ../../docker-compose.e2e.yml up --build",
    url: process.env.FRONTEND_URL ?? "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // Give Docker plenty of time to build images
    // Gracefully shut down the docker container
    gracefulShutdown: {
      signal: "SIGTERM",
      timeout: 5000, // Give Docker 5 seconds to shut down before forcing a SIGKILL
    },
  },
});
