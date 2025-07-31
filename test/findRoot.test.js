import assert from 'node:assert';
import {fileURLToPath} from 'node:url';
import {findRoot} from '../lib/findRoot.js';
import path from 'node:path';
import {test} from 'node:test';

test('findRoot', async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const root = await findRoot(__dirname, 'package.json');
  assert.equal(root, path.resolve(__dirname, '../package.json'));
  await assert.rejects(() => findRoot(__dirname, '......DOES.NOT.EXIST....TEST...TEST.TEST'));
});
