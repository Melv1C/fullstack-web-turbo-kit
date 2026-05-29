import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const cleanOldLogs = vi.fn();
const loggerInfo = vi.fn();
const loggerError = vi.fn();
const isAdmin = vi.fn();

vi.mock("@/utils/log-utils", () => ({
  cleanOldLogs,
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: loggerInfo,
    error: loggerError,
  },
}));

vi.mock("@/middlewares/use-auth", () => ({
  isAdmin,
}));

vi.mock("varlock/env", () => ({
  ENV: {
    CRON_SECRET: "dev_cron_secret_at_least_32_characters",
  },
}));

async function createApp() {
  const { logCleanupRoutes } = await import("./log-cleanup");
  return new Hono().route("/", logCleanupRoutes);
}

describe("log cleanup cron route", () => {
  beforeEach(() => {
    cleanOldLogs.mockReset();
    loggerInfo.mockReset();
    loggerError.mockReset();
    isAdmin.mockReset();
    isAdmin.mockImplementation(async (_c: unknown, next: () => Promise<void>) => {
      await next();
    });
    cleanOldLogs.mockResolvedValue(3);
  });

  it("runs cleanup when a valid cron secret is provided", async () => {
    const app = await createApp();

    const response = await app.request("/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-cron-secret": "dev_cron_secret_at_least_32_characters",
      },
      body: JSON.stringify({ daysToKeep: 14 }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: "Log cleanup completed; deleted 3 logs",
      deletedCount: 3,
      daysToKeep: 14,
    });
    expect(cleanOldLogs).toHaveBeenCalledWith(14);
    expect(isAdmin).not.toHaveBeenCalled();
  });

  it("rejects invalid cron secrets without checking admin auth", async () => {
    const app = await createApp();

    const response = await app.request("/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-cron-secret": "wrong-secret",
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(cleanOldLogs).not.toHaveBeenCalled();
    expect(isAdmin).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledWith("Invalid cron secret provided");
  });

  it("falls back to admin auth when no cron secret header is sent", async () => {
    const app = await createApp();

    const response = await app.request("/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(200);
    expect(isAdmin).toHaveBeenCalled();
    expect(cleanOldLogs).toHaveBeenCalledWith(30);
  });
});
