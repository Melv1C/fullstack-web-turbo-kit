/**
 * Bridge Configuration - Implementations for Main Process
 *
 * Implement all IPC bridge functions here. Channel names are defined in bridge-channels.ts.
 * TypeScript will error if you forget to implement a channel.
 *
 * To add a new bridge function:
 * 1. Add the channel name to `bridge-channels.ts`
 * 2. Add the implementation in the appropriate feature folder (e.g., features/files/)
 * 3. Import and add it to bridgeConfig below
 */

import type { BridgeChannel } from './bridge-channels';
import { appFeatures, filesFeatures } from './features';

// Ensures all channels are implemented - TypeScript will error if any are missing

export const bridgeConfig = {
  // App features
  ...appFeatures,

  // File system features
  ...filesFeatures,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<BridgeChannel, (...args: any[]) => Promise<any>>;
