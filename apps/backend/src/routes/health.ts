import { Hono } from "hono";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export const healthRoutes = new Hono().get("/", async (c) => {
  logger.info("Health check requested");
  const isDatabaseConnected = await prisma.$queryRaw`SELECT 1`; // Simple query to check database connectivity;
  logger.info("Database connectivity check completed", {
    metadata: { isDatabaseConnected: !!isDatabaseConnected },
  });
  return c.json(
    {
      status: "ok",
      database: isDatabaseConnected ? "connected" : "disconnected",
    },
    200,
  );
});
