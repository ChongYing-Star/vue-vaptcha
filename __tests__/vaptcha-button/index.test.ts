import { test, expect } from 'vitest';

test('Exports', async () => {
  const exports_ = await import('@packages/vaptcha-button/index');
  const { default: Button } = await import('@packages/vaptcha-button/src/vaptcha-button.vue');
  expect(exports_.default).toBe(Button);
});
