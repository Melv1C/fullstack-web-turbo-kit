import { Hono } from "hono";
import * as z from "zod";

import { logger } from "@/lib/logger";
import { isAdmin } from "@/middlewares/use-auth";
import { cleanOldLogs } from "@/utils/log-utils";

const logCleanupRequestSchema$ = z.object({
  daysToKeep: z.coerce.number().int().nonnegative().default(30),
});

export const logCleanupRoutes = new Hono().post("/", isAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const result = logCleanupRequestSchema$.safeParse(body);

  if (!result.success) {
    return c.json(
      { error: "Invalid log cleanup request", issues: z.treeifyError(result.error) },
      400,
    );
  }

  const { daysToKeep } = result.data;

  logger.info("Starting log cleanup", {
    metadata: {
      daysToKeep,
    },
  });

  const deletedCount = await cleanOldLogs(daysToKeep);

  logger.info("Log cleanup completed", {
    metadata: {
      deletedCount,
      daysToKeep,
    },
  });

  return c.json({
    message: `Log cleanup completed; deleted ${deletedCount} logs`,
    deletedCount,
    daysToKeep,
  });
});
