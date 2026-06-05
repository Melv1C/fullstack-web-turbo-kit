import { createPrismaClient, type Prisma } from "@repo/database";
import { ENV } from "varlock/env";

import { logger } from "@/lib/logger";

const clients = createPrismaClient({
  connectionString: ENV.DATABASE_URL,
  onQuery: (event) => {
    logger.info("Prisma Query", {
      metadata: {
        query: event.query,
        params: event.params,
        duration: event.duration,
      },
    });
  },
  reuseGlobal: ENV.APP_ENV === "development",
});

export const prisma = clients.prisma;
export const prismaWithoutLog = clients.prismaWithoutLog;

export type { Prisma };
