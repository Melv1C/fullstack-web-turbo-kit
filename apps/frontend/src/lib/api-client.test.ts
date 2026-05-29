import { describe, expect, it, vi } from "vite-plus/test";

const hc = vi.fn(() => ({ api: {} }));

vi.mock("hono/client", () => ({
  hc,
}));

describe("apiClient", () => {
  it("creates a Hono client with cookie credentials", async () => {
    const { apiClient } = await import("./api-client");

    expect(apiClient).toEqual({ api: {} });
    expect(hc).toHaveBeenCalledWith(expect.any(String), {
      init: {
        credentials: "include",
      },
    });
    expect(hc.mock.calls[0]?.[0]).toMatch(/^https?:\/\//);
  });
});
