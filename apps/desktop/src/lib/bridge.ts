// Bridge API Client for Renderer
// Usage: import { getBridge } from './lib/bridge';

import type { bridgeConfig } from '../bridge/bridge-config';

type Bridge = typeof bridgeConfig;

function getBridge(): Bridge {
  if (typeof window === 'undefined' || !window.bridge) {
    throw new Error('Bridge not available. Are you running in Electron?');
  }
  return window.bridge as unknown as Bridge;
}

export const bridge = getBridge();
