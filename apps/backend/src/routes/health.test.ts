import { describe, expect, it, vi } from "vitest";

const queryRaw = vi.fn();
const loggerInfo = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: queryRaw,
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: loggerInfo,
  },
}));

describe("health routes", () => {
  it("reports database connectivity", async () => {
    queryRaw.mockResolvedValue([{ "?column?": 1 }]);
    const { healthRoutes } = await import("./health");

    const response = await healthRoutes.request("/");

    await expect(response.json()).resolves.toEqual({
      status: "ok",
      database: "connected",
    });
    expect(response.status).toBe(200);
    expect(loggerInfo).toHaveBeenCalledWith("Health check requested");
  });
});
