/**
 * Bridge Channels - Single Source of Truth
 *
 * Define all bridge channel names here. This is the ONLY file you need to update
 * when adding a new bridge function (besides implementing it in bridge-config.ts).
 *
 * TypeScript will enforce that bridge-config.ts implements all channels.
 */

export const bridgeChannels = [
  'ping',
  'getAppVersion',
  'getAppName',
  'openExternal',
  'showMessageBox',
  'getPlatform',
  // File CRUD operations
  'readFile',
  'writeFile',
  'deleteFile',
  'listFiles',
  'fileExists',
  'selectFile',
  'selectSaveFile',
] as const;

export type BridgeChannel = (typeof bridgeChannels)[number];
