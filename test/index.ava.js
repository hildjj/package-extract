import {fileURLToPath} from 'url'
import {packageExtract} from '../lib/index.js'
import path from 'path'
// eslint-disable-next-line node/no-missing-import
import test from 'ava'
import {unlink} from 'fs/promises'
import {version} from '../package.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('packageExtract', async t => {
  let out = null
  const opts = {
    log(str) {
      out = str
    },
    output: '-',
  }
  await packageExtract(opts, ['name', 'homepage'])
  t.is(out, `\
// Generated by package-extract v${version}
// Do not modify by hand.

export const name = 'package-extract'
export const homepage = 'https://github.com/hildjj/package-extract'
`)
  out = null
  await packageExtract(opts, [])
  t.is(out, `\
// Generated by package-extract v${version}
// Do not modify by hand.

export const version = '${version}'
`)
  out = null
  await t.throwsAsync(() => packageExtract(opts, ['field does not exist']))
  t.is(out, null)

  const output = path.join(__dirname, 'testOutput.js')
  await packageExtract({...opts, output})
  await unlink(output)
})