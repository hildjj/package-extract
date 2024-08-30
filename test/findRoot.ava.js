import {fileURLToPath} from 'node:url';
import {findRoot} from '../lib/findRoot.js';
import path from 'node:path';
import test from 'ava';

test('findRoot', async t => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const root = await findRoot(__dirname, 'package.json');
  t.is(root, path.resolve(__dirname, '../package.json'));
  await t.throwsAsync(() => findRoot(__dirname, '......DOES.NOT.EXIST....TEST...TEST.TEST'));
});
