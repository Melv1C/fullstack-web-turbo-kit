import { timingSafeEqual } from "node:crypto";

import type { Context, Next } from "hono";
import { ENV } from "varlock/env";

import { logger } from "@/lib/logger";

import { isAdmin } from "./use-auth";

function isValidCronSecret(provided: string): boolean {
  const expected = ENV.CRON_SECRET;
  if (!expected) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  // Constant-time compare: `===` can stop at the first mismatch and leak how much
  // of the secret was correct via response timing.
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export const isCronOrAdmin = async (c: Context, next: Next) => {
  const cronSecret = c.req.header("x-cron-secret");

  if (cronSecret) {
    if (isValidCronSecret(cronSecret)) {
      await next();
      return;
    }

    logger.error("Invalid cron secret provided");
    return c.json({ error: "Unauthorized" }, 401);
  }

  return isAdmin(c, next);
};
