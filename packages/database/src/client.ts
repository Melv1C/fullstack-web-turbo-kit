import { PrismaPg } from "@prisma/adapter-pg";

import { type Prisma, PrismaClient } from "../generated/prisma/client.js";

type QueryLoggingPrismaClient = PrismaClient & {
  $on(event: "query", callback: (event: Prisma.QueryEvent) => void): void;
};

export type PrismaQueryEvent = {
  query: string;
  params: string;
  duration: number;
};

export type CreatePrismaClientOptions = {
  connectionString: string;
  onQuery?: (event: PrismaQueryEvent) => void;
  reuseGlobal?: boolean;
};

export type PrismaClients = {
  prisma: PrismaClient;
  prismaWithoutLog: PrismaClient;
};

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaWithoutLog?: PrismaClient;
};

export function createPrismaClient(options: CreatePrismaClientOptions): PrismaClients {
  const adapter = new PrismaPg({
    connectionString: options.connectionString,
  });

  const prismaWithoutLog =
    (options.reuseGlobal ? globalForPrisma.prismaWithoutLog : undefined) ??
    new PrismaClient({ adapter });

  if (!options.onQuery) {
    if (options.reuseGlobal) {
      globalForPrisma.prismaWithoutLog = prismaWithoutLog;
    }
    return { prisma: prismaWithoutLog, prismaWithoutLog };
  }

  const prisma: QueryLoggingPrismaClient =
    (options.reuseGlobal ? globalForPrisma.prisma : undefined) ??
    (new PrismaClient({
      adapter,
      log: [{ emit: "event", level: "query" }],
    }) as QueryLoggingPrismaClient);

  prisma.$on("query", (event) => {
    options.onQuery?.({
      query: event.query,
      params: event.params,
      duration: event.duration,
    });
  });

  if (options.reuseGlobal) {
    globalForPrisma.prisma = prisma;
    globalForPrisma.prismaWithoutLog = prismaWithoutLog;
  }

  return { prisma, prismaWithoutLog };
}
