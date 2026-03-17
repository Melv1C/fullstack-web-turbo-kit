import { initializeSocketIO } from '@/lib/socket';
import { routes } from '@/routes';
import { serve } from '@hono/node-server';
import { APP_NAME } from '@repo/utils';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Server as HTTPServer } from 'node:http';
import { ENV } from 'varlock';
import 'varlock/auto-load';
import pkg from '../package.json' with { type: 'json' };

const app = new Hono()
  .use(
    cors({
      origin: [ENV.FRONTEND_URL, ENV.ADMIN_URL],
      credentials: true,
    }),
  )
  .route('/api', routes);

export type AppType = typeof app;

const httpServer = serve(
  {
    fetch: app.fetch,
    port: ENV.BACKEND_PORT,
  },
  info => {
    console.log(`🚀 Backend server running on port ${info.port}`);
    console.log(`   App Name: ${APP_NAME}`);
    console.log(`   App Version: ${pkg.version}`);
  },
);

// Initialize Socket.IO with the HTTP server
initializeSocketIO(httpServer as HTTPServer);
