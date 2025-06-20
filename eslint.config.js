import base from '@cto.af/eslint-config';
import markdown from '@cto.af/eslint-config/markdown.js';
import mod from '@cto.af/eslint-config/module.js';

export default [
  {
    ignores: [
      '**/*.d.ts',
    ],
  },
  ...base,
  ...mod,
  ...markdown,
  {
    files: [
      '*.md/*.js',
    ],
    rules: {
      'n/no-top-level-await': 'off',
    },
  },
];
