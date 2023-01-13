/* eslint-disable no-control-regex */
/* eslint-disable array-element-newline */

// This is such massive overkill, but none of the existing stringify packages
// had support for trailing commas, choosing quotes, and setting indent
// styles.

// Close-enough for "does this need to be quoted as an object key"
const IDENTIFIER = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/u
// Only decimal literals for the moment.  NOTE `-` is an operator, not part of
// the literal.
const NUMERIC = /^\d+(?:\.\d*)?(?:[eE][+-]?\d+)?$/

// Taken from util.inspect:
const meta = [
  '\\x00', '\\x01', '\\x02', '\\x03', '\\x04', '\\x05', '\\x06', '\\x07',
  '\\b', '\\t', '\\n', '\\x0B', '\\f', '\\r', '\\x0E', '\\x0F',
  '\\x10', '\\x11', '\\x12', '\\x13', '\\x14', '\\x15', '\\x16', '\\x17',
  '\\x18', '\\x19', '\\x1A', '\\x1B', '\\x1C', '\\x1D', '\\x1E', '\\x1F',
  '', '', '\\"', '', '', '', '', '\\\'', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '', '', '', '\\\\', '', '', '',
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '\\x7F',
  '\\x80', '\\x81', '\\x82', '\\x83', '\\x84', '\\x85', '\\x86', '\\x87',
  '\\x88', '\\x89', '\\x8A', '\\x8B', '\\x8C', '\\x8D', '\\x8E', '\\x8F',
  '\\x90', '\\x91', '\\x92', '\\x93', '\\x94', '\\x95', '\\x96', '\\x97',
  '\\x98', '\\x99', '\\x9A', '\\x9B', '\\x9C', '\\x9D', '\\x9E', '\\x9F',
]
// Second half of this is unpaired surrogates
const replDouble = /[\x00-\x1f\x22\x5c\x7f-\x9f]|[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g
const replSingle = /[\x00-\x1f\x27\x5c\x7f-\x9f]|[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g

function strEscape(s, replacer) {
  return s.replace(replacer, c => {
    const code = c.charCodeAt(0)
    return code < meta.length ? meta[code] : `\\u${code.toString(16)}`
  })
}

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
 * @param {StringifyOpts} opts Options
 * @param {number} [depth=0] Depth into the object tree
 * @returns {string} The stringified version
 */
export function stringify(val, opts, depth = 0) {
  function indent(d) {
    if (opts.newline === '') {
      return opts.indent
    }
    return opts.indent.repeat(d)
  }
  // Only need to handle things that could have been parsed from JSON.
  switch (typeof val) {
    case 'number':
      return Object.is(val, -0) ? '-0' : String(val)
    case 'boolean':
      return String(val)
    case 'string': {
      const rep = (opts.quote === '"') ? replDouble : replSingle
      return `${opts.quote}${strEscape(val, rep)}${opts.quote}`
    }
    case 'object': {
      if (!val) {
        return 'null'
      }
      if (Array.isArray(val)) {
        let first = true
        if (val.length === 0) {
          return '[]'
        }
        let ret = `[${opts.newline}`
        for (const v of val) {
          if (first) {
            first = false
          } else {
            ret += `,${opts.newline}`
          }
          ret += indent(depth + 1)
          ret += stringify(v, opts, depth + 1)
        }
        if (opts.trailing) {
          ret += ','
        }
        ret += opts.newline
        ret += indent(depth)
        ret += ']'
        return ret
      }
      // Plain object
      const entries = Object.entries(val)
      if (entries.length === 0) {
        return '{}'
      }
      let ret = `{${opts.newline}`
      let first = true
      for (const [key, value] of entries) {
        if (first) {
          first = false
        } else {
          ret += `,${opts.newline}`
        }
        ret += indent(depth + 1)
        if (IDENTIFIER.test(key) || NUMERIC.test(key)) {
          ret += key
        } else {
          ret += stringify(key, opts, depth + 1)
        }
        ret += ': '
        ret += stringify(value, opts, depth + 1)
      }
      if (opts.trailing) {
        ret += ','
      }
      ret += opts.newline
      ret += indent(depth)
      ret += '}'
      return ret
    }
    default:
      throw new Error(`Cannot stringify type ${typeof val}: "${val}"`)
  }
}
