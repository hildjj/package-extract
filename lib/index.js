/* eslint-disable no-console */
import {readFile, writeFile} from 'fs/promises'
import {EOL} from 'os'
import {findRoot} from './findRoot.js'
import {stringify} from './stringify.js'
import {version} from '../package.js'

const PREAMBLE = `\
// Generated by package-extract v${version}
// Do not modify by hand.

`

/**
 * @typedef {Object} ExtractOpts packageExtract options
 * @property {boolean} [double=false] True for double quotes, otherwise single
 *   quotes
 * @property {number} [indent=2] Number of spaces to indent. <0 for tabs. 0
 *   for no newlines.
 * @property {(string) => void} [log=console.log] How to log to stdout.
 * @property {string} [output="package.js"] Filename for output, or "-" for
 *   stdout.
 * @property {string} [package="package.json"] Package file to extract from,
 *   found from cwd, searching up
 * @property {boolean} [semi=false] Add semicolons to the end of each
 *   variable.
 * @property {string} [startDir=process.cwd()] Which directory to start the
 *   search from.
 * @property {boolean} [trailing=false] Add trailing commas for objects or
 *   arrays?
 */

/**
 * Extract one or more fields from a JSON file.
 * @param {ExtractOpts} opts
 * @param {string[]} [fields=['version']]
 */
export async function packageExtract(opts = {}, fields = ['version']) {
  opts = {
    double: false,
    indent: 2,
    output: 'package.js',
    log: console.log,
    package: 'package.json',
    semi: false,
    startDir: process.cwd(),
    trailing: false,
    ...opts,
  }
  if (fields.length === 0) {
    fields = ['version']
  }
  const strOpts = {
    trailing: opts.trailing,
    indent: opts.indent < 0 ? '\t'.repeat(-opts.indent) : ' '.repeat(opts.indent || 1),
    quote: opts.double ? '"' : '\'',
    newline: opts.indent === 0 ? '' : EOL,
  }

  const pkg = await findRoot(process.cwd(), opts.package)
  const props = JSON.parse(await readFile(pkg, 'utf8'))
  let out = PREAMBLE
  for (const field of fields) {
    if (props[field] == null) {
      throw new Error(`Property "${field}" not found in "${pkg}"`)
    }
    out += `export const ${field} = ${stringify(props[field], strOpts)}${opts.semi ? ';' : ''}\n`
  }
  if (opts.output === '-') {
    opts.log(out)
  } else {
    await writeFile(opts.output, out, 'utf8')
  }
}
