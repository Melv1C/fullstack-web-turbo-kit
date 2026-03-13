import { NodeEnv$ } from '@repo/utils';
import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_NODE_ENV: NodeEnv$,
  EXPO_PUBLIC_BACKEND_URL: z.url().default('http://localhost:3000'),
});

console.log('Raw env:', process.env);

export const env = envSchema.parse(process.env);
