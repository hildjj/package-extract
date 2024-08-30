import * as path from 'node:path';
import {access} from 'node:fs/promises';

/**
 * Starting from startDir, look for a file named packageName in subsequent
 * parent directories until the file is found.  This just checks if the file
 * is visible, not whether it is readable, writable, or executable.
 *
 * @param {string} startDir The directory to start from
 * @param {string} packageName The no-directory file name to search for
 * @returns {Promise<string>} The full path of the file that was found,
 *   rejects if none is found or if there is a symlink loop.
 */
export async function findRoot(startDir, packageName) {
  const prev = new Set(); // Catch symlink loops and the root directory
  let dir = startDir;
  while (dir) {
    if (prev.has(dir)) {
      break;
    }
    try {
      const f = path.join(dir, packageName);
      await access(f);
      return f;
    } catch (ignored) {
      prev.add(dir);
      dir = path.dirname(dir);
    }
  }
  throw new Error(`No ${packageName} file found starting from ${startDir}`);
}
