import { NodeEnv$ } from "@repo/utils";
import * as z from "zod";

const E2eEnv$ = z.object({
  APP_ENV: NodeEnv$.default("test"),
  DATABASE_URL: z.url().default("postgresql://postgres:postgres@localhost:5432/postgres"),
  BETTER_AUTH_SECRET: z
    .string()
    .trim()
    .min(32)
    .default("your_secret_key_here_of_at_least_32_characters"),
  BACKEND_URL: z.url().default("http://localhost:3000"),
  FRONTEND_URL: z.url().default("http://localhost:5173"),
  ADMIN_URL: z.url().default("http://localhost:5174"),
});

export const ENV = E2eEnv$.parse(process.env);
