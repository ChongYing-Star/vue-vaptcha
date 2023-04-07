import { test, expect } from 'vitest';
import { use, option } from '@packages/config';

test.each([
  { scene: 1 },
  { scene: 2, lang: 'auto' },
  { lang: 'auto' },
  { area: 'auto' },
])('Use "%o"', (o) => {
  const old = { ...option };
  use(o as any);
  expect(option).toEqual({ ...old, ...o });
});

test('Set option will fail', () => {
  expect(() => { (option as any).color = '#fff'; }).toThrowError(TypeError);
});