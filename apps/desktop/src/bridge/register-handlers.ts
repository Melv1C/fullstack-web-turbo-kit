/**
 * Register Handlers - Auto-register IPC handlers from bridge config
 *
 * This module loops over all functions in bridgeConfig and registers
 * them as IPC handlers in the main process.
 */

import { ipcMain } from 'electron';
import { bridgeConfig } from './bridge-config';

/**
 * Register all bridge handlers with ipcMain.
 * Call this once during app initialization in main.ts
 */
export function registerBridgeHandlers(): void {
  const channels = Object.keys(bridgeConfig) as (keyof typeof bridgeConfig)[];

  for (const channel of channels) {
    const handler = bridgeConfig[channel];

    ipcMain.handle(channel, async (_event, ...args: unknown[]) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await (handler as (...args: any[]) => Promise<any>)(...args);
      } catch (error) {
        console.error(`[Bridge] Error in handler "${channel}":`, error);
        throw error;
      }
    });
  }

  console.log(`[Bridge] Registered ${channels.length} handlers:`, channels.join(', '));
}

/**
 * Unregister all bridge handlers.
 * Useful for cleanup or hot-reloading scenarios.
 */
export function unregisterBridgeHandlers(): void {
  const channels = Object.keys(bridgeConfig) as (keyof typeof bridgeConfig)[];

  for (const channel of channels) {
    ipcMain.removeHandler(channel);
  }

  console.log(`[Bridge] Unregistered ${channels.length} handlers`);
}
