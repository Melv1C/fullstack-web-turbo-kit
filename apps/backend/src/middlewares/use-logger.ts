import { levelPriority, type LogLevel, type LogStep, type Method } from "@repo/utils";
import type { Context, Next } from "hono";

import { logger } from "@/lib/logger";

declare module "hono" {
  interface ContextVariableMap {
    logSteps: LogStep[];
  }
}

export const useLogger = async (c: Context, next: Next) => {
  const start = Date.now();
  c.set("logSteps", []);

  logger.info(`Incoming request: ${c.req.method} ${c.req.path}`);

  try {
    await next();
  } finally {
    const durationMs = Date.now() - start;

    // Compute the overall log level based on the steps
    const overallLevel = c.var.logSteps.reduce<LogLevel>((highest, step) => {
      return levelPriority[step.level] > levelPriority[highest] ? step.level : highest;
    }, "debug");

    logger.log({
      level: overallLevel,
      message: `Request ${c.req.method} ${c.req.path} completed`,
      type: "REQUEST",
      method: c.req.method as Method,
      path: c.req.path,
      statusCode: c.res.status,
      durationMs,
      userId: c.get("user")?.id,
      steps: c.var.logSteps,
    });
  }
};
