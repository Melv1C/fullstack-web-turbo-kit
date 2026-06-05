import type { PrismaClient } from "@repo/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, testUtils } from "better-auth/plugins";

export type CreateAuthOptions = {
  prisma: PrismaClient;
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
  hasTestUtils?: boolean;
};

const basePlugins = [admin()] as const;

export function createAuth(options: CreateAuthOptions) {
  return betterAuth({
    database: prismaAdapter(options.prisma, {
      provider: "postgresql",
    }),
    secret: options.secret,
    baseURL: options.baseURL,
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: options.trustedOrigins,
    plugins: [...basePlugins, ...(options.hasTestUtils ? [testUtils()] : [])],
  });
}

export type Auth = ReturnType<typeof createAuth>;
