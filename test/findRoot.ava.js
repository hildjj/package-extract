import {fileURLToPath} from 'url'
import {findRoot} from '../lib/findRoot.js'
import path from 'path'
// eslint-disable-next-line node/no-missing-import
import test from 'ava'

test('findRoot', async t => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const root = await findRoot(__dirname, 'package.json')
  t.is(root, path.resolve(__dirname, '../package.json'))
  await t.throwsAsync(() => findRoot(__dirname, '......DOES.NOT.EXIST....TEST...TEST.TEST'))
})
