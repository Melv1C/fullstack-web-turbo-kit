import { createApiClient } from '@repo/api-client';
import { ENV } from 'varlock/env';

export const apiClient = createApiClient(ENV.BACKEND_URL);
