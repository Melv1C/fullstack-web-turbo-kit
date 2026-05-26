import { getRoomName, Log$, LogCreate$, LogData$, type LogCreate } from "@repo/utils";
import { tryGetContext } from "hono/context-storage";
import { ENV } from "varlock";
import winston from "winston";
import Transport from "winston-transport";

import { prismaWithoutLog } from "./prisma";
import { emitToRoom } from "./socket";

class PostgresTransport extends Transport {
  override async log(info: LogCreate, callback: () => void) {
    setImmediate(callback);
    const { level, message, type, ...metadata } = LogCreate$.parse(info);

    const context = tryGetContext();

    if (context && context.var.logSteps && type !== "REQUEST") {
      // If we have a context, we can get the request-specific log steps
      context.var.logSteps.push({
        level,
        message,
        metadata: Object.keys(metadata).length === 0 ? undefined : metadata,
        timestamp: Date.now(),
      });
      return; // Don't persist non-REQUEST logs immediately - they'll be included in the parent REQUEST log
    }

    try {
      const { userId, method, path, statusCode, durationMs, steps, ...meta } =
        LogData$.parse(metadata);
      const log = await prismaWithoutLog.log.create({
        data: {
          type,
          level,
          message,
          userId: userId ?? undefined,
          // ts-ignore because prisma doesn't accept {[x: string]: unknown} even though it's JSON-serializable
          // @ts-ignore
          metadata: meta ?? undefined,
          method,
          path,
          statusCode,
          durationMs,
          // ts-ignore because prisma doesn't support unknown type, but we know it's JSON serializable from the schema validation
          // @ts-ignore
          steps: steps ?? undefined,
        },
      });
      // Emit the new log to all subscribed clients
      emitToRoom(getRoomName.logs, "log:created", Log$.parse(log));
    } catch (err) {
      // NEVER throw from logger - errors degrade gracefully
      console.error("Failed to persist log", err);
    }
  }
}

const isDev = ENV.APP_ENV === "development";

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: isDev ? "debug" : "warn",
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new PostgresTransport({
      level: isDev ? "debug" : "info", // In production, persist info and above to reduce noise
    }),
  ],
});
