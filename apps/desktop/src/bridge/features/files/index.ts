/**
 * File System Bridge Functions
 *
 * All file-related IPC bridge implementations.
 */

import { dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Read file contents as text
 */
export const readFile = async (filePath: string) => {
  console.log('Reading file:', filePath);
  return await fs.readFile(filePath, 'utf-8');
};

/**
 * Write text content to file
 */
export const writeFile = async (filePath: string, content: string) => {
  // Ensure directory exists
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
  return true;
};

/**
 * Delete a file
 */
export const deleteFile = async (filePath: string) => {
  await fs.unlink(filePath);
  return true;
};

/**
 * List files in a directory
 */
export const listFiles = async (dirPath: string) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.map(entry => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
    path: path.join(dirPath, entry.name),
  }));
};

/**
 * Check if file exists
 */
export const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Open native file picker dialog
 */
export const selectFile = async (options?: {
  title?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  defaultPath?: string;
}) => {
  const result = await dialog.showOpenDialog({
    title: options?.title ?? 'Select File',
    properties: ['openFile'],
    filters: options?.filters,
    defaultPath: options?.defaultPath,
  });
  return result.canceled ? null : (result.filePaths[0] ?? null);
};

/**
 * Open native save file dialog
 */
export const selectSaveFile = async (options?: {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
}) => {
  const result = await dialog.showSaveDialog({
    title: options?.title ?? 'Save File',
    defaultPath: options?.defaultPath,
    filters: options?.filters,
  });
  return result.canceled ? null : (result.filePath ?? null);
};
