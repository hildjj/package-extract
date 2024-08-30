/**
 * @typedef {Object} StringifyOpts Stringify options
 * @property {string} quote Which quote style to use
 * @property {string} indent The indent string, either spaces or tabs
 * @property {boolean} trailing Add trailing commas for objects or arrays?
 * @property {string} newline Line endings.  May be "".
 */
/**
 * Turn a JS value into something quoted and indented such that it can be
 * rehydrated as an equivalent JS value with eval (for example.  Don't
 * actually use eval.)
 *
 * Note: This only handles value types that can be parsed from JSON!
 *
 * @param {any} val The value to stringify
 * @param {StringifyOpts} options Options
 * @param {number} [depth=0] Depth into the object tree
 * @returns {string} The stringified version
 */
export function stringify(val: any, options: StringifyOpts, depth?: number): string;
/**
 * Stringify options
 */
export type StringifyOpts = {
    /**
     * Which quote style to use
     */
    quote: string;
    /**
     * The indent string, either spaces or tabs
     */
    indent: string;
    /**
     * Add trailing commas for objects or arrays?
     */
    trailing: boolean;
    /**
     * Line endings.  May be "".
     */
    newline: string;
};
