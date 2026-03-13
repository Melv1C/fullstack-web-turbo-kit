/**
 * App Bridge Functions
 *
 * Application-related IPC bridge implementations.
 */

import { app, dialog, shell } from 'electron';

/**
 * Simple ping/pong for testing connectivity
 */
export const ping = async () => {
  return 'pong' as const;
};

/**
 * Get app version from package.json
 */
export const getAppVersion = async () => {
  return app.getVersion();
};

/**
 * Get app name
 */
export const getAppName = async () => {
  return app.getName();
};

/**
 * Open external URL in default browser
 */
export const openExternal = async (url: string) => {
  await shell.openExternal(url);
  return true;
};

/**
 * Show native message box
 */
export const showMessageBox = async (options: {
  type?: 'none' | 'info' | 'error' | 'question' | 'warning';
  title?: string;
  message: string;
  buttons?: string[];
}) => {
  const result = await dialog.showMessageBox({
    type: options.type ?? 'info',
    title: options.title ?? 'Message',
    message: options.message,
    buttons: options.buttons ?? ['OK'],
  });
  return {
    response: result.response,
    checkboxChecked: result.checkboxChecked,
  };
};

/**
 * Get platform info
 */
export const getPlatform = async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
  };
};
