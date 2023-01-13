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
export function findRoot(startDir: string, packageName: string): Promise<string>;
