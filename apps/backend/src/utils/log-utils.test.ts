import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const deleteMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prismaWithoutLog: {
    log: {
      deleteMany,
    },
  },
}));

describe("log utils", () => {
  beforeEach(() => {
    deleteMany.mockReset();
    deleteMany.mockResolvedValue({ count: 7 });
  });

  it("deletes logs older than the default retention window", async () => {
    const { cleanOldLogs } = await import("./log-utils");

    await expect(cleanOldLogs()).resolves.toBe(7);
    expect(deleteMany).toHaveBeenCalledTimes(1);
    const cutoff = deleteMany.mock.calls[0]?.[0].where.createdAt.lt;

    expect(cutoff).toBeInstanceOf(Date);
    expect(cutoff.getTime()).toBeLessThanOrEqual(Date.now() - 30 * 24 * 60 * 60 * 1000);
  });

  it("uses a custom retention window", async () => {
    const { cleanOldLogs } = await import("./log-utils");

    const result = await cleanOldLogs(10);
    expect(deleteMany).toHaveBeenCalledTimes(1);
    const cutoff = deleteMany.mock.calls[0]?.[0].where.createdAt.lt;

    expect(result).toBe(7);
    expect(cutoff).toBeInstanceOf(Date);
    expect(cutoff.getTime()).toBeLessThanOrEqual(Date.now() - 10 * 24 * 60 * 60 * 1000);
  });
});
