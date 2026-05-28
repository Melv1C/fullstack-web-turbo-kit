import { describe, expect, it } from "vitest";

import { LogCreate$, LogFilter$, levelPriority } from "./log";

describe("log schemas", () => {
  it("applies defaults and trims log creation input", () => {
    const log = LogCreate$.parse({
      level: "info",
      message: "  User logged in  ",
      metadata: { ip: "127.0.0.1" },
    });

    expect(log).toEqual({
      type: "APP",
      level: "info",
      message: "User logged in",
      metadata: { ip: "127.0.0.1" },
    });
  });

  it("coerces pagination values and comma-separated filters", () => {
    const filter = LogFilter$.parse({
      page: "2",
      pageSize: "25",
      levels: "warn,error",
      types: "REQUEST,APP",
      search: "  timeout  ",
      startDate: "2026-05-01T00:00:00.000Z",
    });

    expect(filter).toMatchObject({
      page: 2,
      pageSize: 25,
      levels: ["warn", "error"],
      types: ["REQUEST", "APP"],
      search: "timeout",
    });
    expect(filter.startDate).toEqual(new Date("2026-05-01T00:00:00.000Z"));
  });

  it("keeps log level priority ordered from least to most severe", () => {
    expect(levelPriority.debug).toBeLessThan(levelPriority.info);
    expect(levelPriority.info).toBeLessThan(levelPriority.warn);
    expect(levelPriority.warn).toBeLessThan(levelPriority.error);
  });
});
