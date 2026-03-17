import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { varlockVitePlugin } from '@varlock/vite-integration';
import react from '@vitejs/plugin-react';
import path from 'path';
import { ENV } from 'varlock';

import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [
    varlockVitePlugin(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: ENV.ADMIN_PORT,
    strictPort: true,
  },
}));
