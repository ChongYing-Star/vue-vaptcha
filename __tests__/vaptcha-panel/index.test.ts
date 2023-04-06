import { test, expect } from 'vitest';

test('Exports', async () => {
  const exports_ = await import('@packages/vaptcha-panel/index');
  const { default: Panel } = await import('@packages/vaptcha-panel/src/vaptcha-panel.vue');
  expect(exports_.default).toBe(Panel);
});
