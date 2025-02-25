import assert from 'node:assert';
import {stringify} from '../lib/stringify.js';
import {test} from 'node:test';

const opts = {
  indent: '  ',
  newline: '\n',
  quote: '"',
  trailing: false,
};

test('simple types', () => {
  assert.equal(stringify(0, opts), '0');
  assert.equal(stringify(-0, opts), '-0');
  assert.equal(stringify(-123.45, opts), '-123.45');
  assert.equal(stringify(-123.45E-19, opts), '-1.2345e-17');
  assert.equal(stringify(NaN, opts), 'NaN');
  assert.equal(stringify(Infinity, opts), 'Infinity');
  assert.equal(stringify(-Infinity, opts), '-Infinity');
  assert.equal(stringify(true, opts), 'true');
  assert.equal(stringify(false, opts), 'false');
  assert.equal(stringify(null, opts), 'null');
});

test('strings', () => {
  assert.equal(stringify('', opts), '""');
  assert.equal(stringify('foo', opts), '"foo"');
  assert.equal(stringify('foo\u0F00', opts), '"foo\u0F00"');
  assert.equal(stringify('\n', opts), '"\\n"');
  assert.equal(stringify('"', opts), '"\\""');
  assert.equal(stringify('\'', {...opts, quote: '\''}), '\'\\\'\'');
  assert.equal(stringify('\ud800', opts), '"\\ud800"'); // Unmatched start surrogate
  assert.equal(stringify('\ud800f', opts), '"\\ud800f"');
  assert.equal(stringify('\udc00', opts), '"\\udc00"'); // Unmatched end surrogate
  assert.equal(stringify('f\udc00', opts), '"f\\udc00"'); // Unmatched end surrogate
  assert.equal(stringify('\u{1F4A9}', opts), '"\u{1F4A9}"'); // Poo
});

test('arrays', () => {
  assert.equal(stringify([], opts), '[]');
  assert.equal(stringify([1], opts), '[\n  1\n]');
  assert.equal(stringify([1], {...opts, trailing: true}), '[\n  1,\n]');
  assert.equal(stringify([1, 2], opts), '[\n  1,\n  2\n]');
});

test('objects', () => {
  assert.equal(stringify({}, opts), '{}');
  assert.equal(stringify({1: 2}, opts), '{\n  1: 2\n}');
  assert.equal(stringify({'-1': 2}, opts), '{\n  "-1": 2\n}');
  assert.equal(stringify({0x12: 2, two: false}, opts), '{\n  18: 2,\n  two: false\n}');
  assert.equal(stringify({'%%%': NaN}, {...opts, trailing: true}), '{\n  "%%%": NaN,\n}');
});

test('zero indent', () => {
  const z = {...opts, newline: '', indent: ' '};
  assert.equal(stringify({}, z), '{}');
  assert.equal(stringify({1: 2}, z), '{ 1: 2 }');
  assert.equal(stringify({1: 2, 3: 4}, z), '{ 1: 2, 3: 4 }');
  assert.equal(stringify([1, 2], z), '[ 1, 2 ]');
  assert.equal(stringify([
    'package.json',
    'version',
  ], z), '[ "package.json", "version" ]');
});
test('invalid', () => {
  assert.throws(() => stringify(Symbol('BAD')));
});
