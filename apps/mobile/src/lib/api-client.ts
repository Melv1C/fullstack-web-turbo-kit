import { createApiClient } from '@repo/api-client';
import { env } from './env';

export const apiClient = createApiClient(env.EXPO_PUBLIC_BACKEND_URL);
