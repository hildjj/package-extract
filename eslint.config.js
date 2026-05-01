import base from '@cto.af/eslint-config';
import {defineConfig} from 'eslint/config';
import markdown from '@cto.af/eslint-config/markdown.js';
import mod from '@cto.af/eslint-config/module.js';

export default defineConfig([
  base,
  mod,
  markdown,
]);
