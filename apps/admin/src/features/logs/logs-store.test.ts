import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { useLogsStore as useLogsStoreType } from "./logs-store";

const storage = new Map<string, string>();
let useLogsStore: typeof useLogsStoreType;

describe("logs store", () => {
  beforeAll(async () => {
    storage.clear();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    });
    ({ useLogsStore } = await import("./logs-store"));
  });

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    storage.clear();
    useLogsStore.setState(useLogsStore.getInitialState(), true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates filters and resets the page unless explicitly provided", () => {
    useLogsStore.getState().updateFilter({ page: 4, pageSize: 25 });
    useLogsStore.getState().updateFilter({ levels: ["error"] });

    expect(useLogsStore.getState().filter).toMatchObject({
      page: 1,
      pageSize: 25,
      levels: ["error"],
    });
  });

  it("preserves page size while clearing filters and search text", () => {
    useLogsStore.getState().updateFilter({ pageSize: 100, search: "timeout", types: ["REQUEST"] });
    useLogsStore.getState().setSearchInput("timeout");
    useLogsStore.getState().clearFilters();

    expect(useLogsStore.getState().filter).toEqual({ page: 1, pageSize: 100 });
    expect(useLogsStore.getState().searchInput).toBe("");
  });

  it("clears the selected log when the detail sheet closes", () => {
    useLogsStore.getState().setSelectedLogId(123);
    useLogsStore.getState().setSheetOpen(true);
    useLogsStore.getState().setSheetOpen(false);

    expect(useLogsStore.getState().sheetOpen).toBe(false);
    expect(useLogsStore.getState().selectedLogId).toBeNull();
  });
});
