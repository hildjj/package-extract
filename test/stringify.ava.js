import {stringify} from '../lib/stringify.js'
import test from 'ava'

const opts = {
  indent: '  ',
  newline: '\n',
  quote: '"',
  trailing: false,
}

test('simple types', t => {
  t.is(stringify(0, opts), '0')
  t.is(stringify(-0, opts), '-0')
  t.is(stringify(-123.45, opts), '-123.45')
  t.is(stringify(-123.45E-19, opts), '-1.2345e-17')
  t.is(stringify(NaN, opts), 'NaN')
  t.is(stringify(Infinity, opts), 'Infinity')
  t.is(stringify(-Infinity, opts), '-Infinity')
  t.is(stringify(true, opts), 'true')
  t.is(stringify(false, opts), 'false')
  t.is(stringify(null, opts), 'null')
})

test('strings', t => {
  t.is(stringify('', opts), '""')
  t.is(stringify('foo', opts), '"foo"')
  t.is(stringify('foo\u0F00', opts), '"foo\u0F00"')
  t.is(stringify('\n', opts), '"\\n"')
  t.is(stringify('"', opts), '"\\""')
  t.is(stringify('\'', {...opts, quote: '\''}), '\'\\\'\'')
  t.is(stringify('\ud800', opts), '"\\ud800"') // Unmatched start surrogate
  t.is(stringify('\ud800f', opts), '"\\ud800f"')
  t.is(stringify('\udc00', opts), '"\\udc00"') // Unmatched end surrogate
  t.is(stringify('f\udc00', opts), '"f\\udc00"') // Unmatched end surrogate
  t.is(stringify('\u{1F4A9}', opts), '"\u{1F4A9}"') // Poo
})

test('arrays', t => {
  t.is(stringify([], opts), '[]')
  t.is(stringify([1], opts), '[\n  1\n]')
  t.is(stringify([1], {...opts, trailing: true}), '[\n  1,\n]')
  t.is(stringify([1, 2], opts), '[\n  1,\n  2\n]')
})

test('objects', t => {
  t.is(stringify({}, opts), '{}')
  t.is(stringify({1: 2}, opts), '{\n  1: 2\n}')
  t.is(stringify({'-1': 2}, opts), '{\n  "-1": 2\n}')
  t.is(stringify({0x12: 2, two: false}, opts), '{\n  18: 2,\n  two: false\n}')
  t.is(stringify({'%%%': NaN}, {...opts, trailing: true}), '{\n  "%%%": NaN,\n}')
})

test('zero indent', t => {
  const z = {...opts, newline: '', indent: ' '}
  t.is(stringify({}, z), '{}')
  t.is(stringify({1: 2}, z), '{ 1: 2 }')
  t.is(stringify({1: 2, 3: 4}, z), '{ 1: 2, 3: 4 }')
  t.is(stringify([1, 2], z), '[ 1, 2 ]')
})
test('invalid', t => {
  t.throws(() => stringify(Symbol('BAD')))
})
