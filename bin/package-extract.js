#!/usr/bin/env node
/* eslint-disable no-console */

import {Command, InvalidArgumentError} from 'commander';
import {packageExtract} from '../lib/index.js';
import {version} from '../package.js';

function myParseInt(value, _dummyPrevious) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

const program = new Command();
program
  .argument('[fields...]', 'fields to extract from package file', ['version'])
  .option('-c, --commonJS', 'create a commonJS file instead of ESM')
  .option('-d, --double', 'use double quotes')
  .option('-i, --indent <number>', 'number of spaces to indent. -1 for tab. 0 for no newlines.', myParseInt, 2)
  .option('-o, --output <filename>', 'name of output file, relative to package.json.  Use "-" for stdout.', 'package.js')
  .option('-p, --package', 'package file to extract from, found from cwd, searching up', 'package.json')
  .option('-s, --semi', 'add semicolons to the end of each variable')
  .option('--startDir <dir>', 'start looking from this directory, toward the root', process.cwd())
  .option('-t, --trailing', 'Add trailing commas')
  .version(version);

program.parse();

packageExtract(program.opts(), program.args).catch(er => {
  console.error(er.message);
  process.exit(1);
});
