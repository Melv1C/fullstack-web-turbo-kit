import { describe, expect, it, vi } from "vitest";

import { getSession, getUser } from "./auth-utils";

function createContext(values: Record<string, unknown>) {
  return {
    get: vi.fn((key: string) => values[key]),
  };
}

describe("auth utils", () => {
  it("returns session and user from Hono context", () => {
    const session = { id: "session-1" };
    const user = { id: "user-1", role: "admin" };
    const context = createContext({ session, user });

    expect(getSession(context as never)).toBe(session);
    expect(getUser(context as never)).toBe(user);
  });

  it("throws clear errors when auth data is missing", () => {
    const context = createContext({});

    expect(() => getSession(context as never)).toThrow("Session not found in context");
    expect(() => getUser(context as never)).toThrow("User not found in context");
  });
});
