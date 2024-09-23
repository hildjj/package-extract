/**
 * @typedef {Object} ExtractOpts packageExtract options
 * @property {boolean} [commonJS=false] Create a commonJS file instead of ESM
 * @property {boolean} [double=false] True for double quotes, otherwise single
 *   quotes
 * @property {number} [indent=2] Number of spaces to indent. <0 for tabs. 0
 *   for no newlines.
 * @property {(string) => void} [log=console.log] How to log to stdout.
 * @property {string|URL} [output="package.js"] Filename for output, or "-"
 *   for stdout.
 * @property {string} [package="package.json"] Package file to extract from,
 *   found from cwd, searching up
 * @property {string} [regex] If given, regular expression to replace instead
 *   of regenerating output.  Regex should have named matching group to
 *   replace, where the matching group name is the desired field.
 * @property {boolean} [semi=false] Add semicolons to the end of each
 *   variable.
 * @property {string} [startDir=process.cwd()] Which directory to start the
 *   search from.
 * @property {boolean} [trailing=false] Add trailing commas for objects or
 *   arrays?
 * @property {boolean} [types=false] Attempt to add typescript type comments
 *   to extracted items.
 */
/**
 * @typedef {Required<ExtractOpts>} RequiredExtractOpts
 */
/**
 * Extract one or more fields from a JSON file.
 * @param {ExtractOpts} options
 * @param {string[]} [fields=['version']]
 */
export function packageExtract(options?: ExtractOpts, fields?: string[]): Promise<void>;
/**
 * packageExtract options
 */
export type ExtractOpts = {
    /**
     * Create a commonJS file instead of ESM
     */
    commonJS?: boolean;
    /**
     * True for double quotes, otherwise single
     * quotes
     */
    double?: boolean;
    /**
     * Number of spaces to indent. <0 for tabs. 0
     * for no newlines.
     */
    indent?: number;
    /**
     * How to log to stdout.
     */
    log?: (string: any) => void;
    /**
     * Filename for output, or "-"
     * for stdout.
     */
    output?: string | URL;
    /**
     * Package file to extract from,
     * found from cwd, searching up
     */
    package?: string;
    /**
     * If given, regular expression to replace instead
     * of regenerating output.  Regex should have named matching group to
     * replace, where the matching group name is the desired field.
     */
    regex?: string;
    /**
     * Add semicolons to the end of each
     * variable.
     */
    semi?: boolean;
    /**
     * Which directory to start the
     * search from.
     */
    startDir?: string;
    /**
     * Add trailing commas for objects or
     * arrays?
     */
    trailing?: boolean;
    /**
     * Attempt to add typescript type comments
     * to extracted items.
     */
    types?: boolean;
};
export type RequiredExtractOpts = Required<ExtractOpts>;
