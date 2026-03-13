/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require('electron');

import { bridgeChannels, type BridgeChannel } from './bridge/bridge-channels';

type BridgeApi = Record<BridgeChannel, (...args: unknown[]) => Promise<unknown>>;

/**
 * Create the bridge API by mapping each channel to an ipcRenderer.invoke call
 */
function createBridgeApi(): BridgeApi {
  const api = {} as BridgeApi;

  for (const channel of bridgeChannels) {
    api[channel] = (...args: unknown[]) => ipcRenderer.invoke(channel, ...args);
  }

  return api;
}

// Expose the bridge API to the renderer process
contextBridge.exposeInMainWorld('bridge', createBridgeApi());
