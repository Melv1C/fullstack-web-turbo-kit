import type { bridgeConfig } from './src/bridge/bridge-config';

declare global {
  interface Window {
    /**
     * Electron IPC bridge API.
     * Types are auto-derived from bridge-config.ts
     */
    bridge: typeof bridgeConfig;
  }
}

export {};
