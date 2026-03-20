import { Prisma, PrismaClient } from "@generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "varlock";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: ENV.DATABASE_URL,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (ENV.APP_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type { Prisma };
