import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const findMany = vi.fn();
const count = vi.fn();
const findUniqueLog = vi.fn();
const findUniqueUser = vi.fn();
const loggerWarn = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prismaWithoutLog: {
    log: {
      findMany,
      count,
      findUnique: findUniqueLog,
    },
    user: {
      findUnique: findUniqueUser,
    },
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    warn: loggerWarn,
  },
}));

vi.mock("@/middlewares/use-auth", () => ({
  isAdmin: async (_c: unknown, next: () => Promise<void>) => {
    await next();
  },
}));

const createdAt = new Date("2026-05-29T10:00:00.000Z");

const log = {
  id: 1,
  type: "APP",
  level: "info",
  message: "Started",
  createdAt,
  userId: null,
  method: null,
  path: null,
  statusCode: null,
  durationMs: null,
  metadata: null,
  steps: null,
};

async function createApp() {
  const { logsRoutes } = await import("./logs");
  return new Hono().route("/", logsRoutes);
}

describe("logs routes", () => {
  beforeEach(() => {
    findMany.mockReset();
    count.mockReset();
    findUniqueLog.mockReset();
    findUniqueUser.mockReset();
    loggerWarn.mockReset();
  });

  it("builds filtered paginated log queries", async () => {
    findMany.mockResolvedValue([log]);
    count.mockResolvedValue(1);
    const app = await createApp();

    const response = await app.request(
      "/?page=2&pageSize=25&levels=warn,error&types=REQUEST&search=timeout&startDate=2026-05-01T00:00:00.000Z&endDate=2026-05-29T00:00:00.000Z",
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      data: [{ id: 1, message: "Started" }],
      pagination: { page: 2, pageSize: 25, total: 1, totalPages: 1 },
    });
    expect(findMany).toHaveBeenCalledWith({
      where: {
        type: { in: ["REQUEST"] },
        level: { in: ["warn", "error"] },
        createdAt: {
          gte: new Date("2026-05-01T00:00:00.000Z"),
          lte: new Date("2026-05-29T00:00:00.000Z"),
        },
        OR: [
          { message: { contains: "timeout", mode: "insensitive" } },
          { path: { contains: "timeout", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      skip: 25,
      take: 25,
    });
  });

  it("returns an empty paginated result set", async () => {
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);
    const app = await createApp();

    const response = await app.request("/?page=1&pageSize=25");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: [],
      pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
    });
    expect(findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 25,
    });
    expect(count).toHaveBeenCalledWith({ where: {} });
  });

  it("calculates first-page boundary pagination", async () => {
    findMany.mockResolvedValue([log]);
    count.mockResolvedValue(101);
    const app = await createApp();

    const response = await app.request("/?page=1&pageSize=50");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      data: [{ id: 1, message: "Started" }],
      pagination: { page: 1, pageSize: 50, total: 101, totalPages: 3 },
    });
    expect(findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 50,
    });
    expect(count).toHaveBeenCalledWith({ where: {} });
  });

  it("returns a log with its user when present", async () => {
    findUniqueLog.mockResolvedValue({ ...log, userId: "A".repeat(32) });
    findUniqueUser.mockResolvedValue({
      id: "A".repeat(32),
      name: "Jane",
      email: "jane@example.com",
      image: null,
    });
    const app = await createApp();

    const response = await app.request("/1");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: 1,
      user: { name: "Jane", email: "jane@example.com" },
    });
  });

  it("returns null for orphaned user references", async () => {
    findUniqueLog.mockResolvedValue({ ...log, userId: "B".repeat(32) });
    findUniqueUser.mockResolvedValue(null);
    const app = await createApp();

    const response = await app.request("/1");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: 1,
      user: null,
    });
    expect(findUniqueUser).toHaveBeenCalledWith({
      where: { id: "B".repeat(32) },
      select: { id: true, name: true, email: true, image: true },
    });
  });

  it("returns 404 for missing logs", async () => {
    findUniqueLog.mockResolvedValue(null);
    const app = await createApp();

    const response = await app.request("/404");

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Log not found" });
    expect(loggerWarn).toHaveBeenCalledWith("Log with id 404 not found");
  });
});
