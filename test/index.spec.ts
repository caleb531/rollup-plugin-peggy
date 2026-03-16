import { rollup } from 'rollup';
import { expect, test } from 'vitest';
import peggy from '../src';

test('should compile grammar into parser', async () => {
  const bundle = await rollup({
    input: 'test/arithmetic.pegjs',
    plugins: [peggy()]
  });

  const outputName = 'test_parser';
  const generated = await bundle.generate({
    name: outputName,
    format: 'iife'
  });
  const { parse } = new Function(
    `${generated.output[0].code}; return ${outputName};`
  )();
  expect(parse('1+2')).toEqual(3);
  expect(() => parse('1+')).toThrow(Error);
});

test('should accept standard Peggy options', async () => {
  const bundle = await rollup({
    input: 'test/arithmetic.pegjs',
    plugins: [peggy({ cache: true })]
  });

  const outputName = 'test_parser';
  const generated = await bundle.generate({
    name: outputName,
    format: 'iife'
  });
  const { parse } = new Function(
    `${generated.output[0].code}; return ${outputName};`
  )();

  // A string with deep nesting (25 levels) would take >10s to parse without
  // cache, causing the test to timeout. With cache: true, it takes <5ms.
  const deepInput = `3*${'('.repeat(25)}1+2`;
  expect(() => parse(deepInput)).toThrow(Error);
});
