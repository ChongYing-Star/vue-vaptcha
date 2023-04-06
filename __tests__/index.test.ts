import { test, expect } from 'vitest';

test('Exports', async () => {
  const [
    exports_,
    { default: VaptchaButton },
    { default: VaptchaPanel },
    { useInvisibleVaptcha, verifyAndGetToken, InitError, VerifyClosed },
    { use },
  ] = await Promise.all([
    import('@packages/index'),
    import('@packages/vaptcha-button/index'),
    import('@packages/vaptcha-panel/index'),
    import('@packages/invisible/index'),
    import('@packages/config'),
  ]);
  expect(exports_.VaptchaButton).toBe(VaptchaButton);
  expect(exports_.VaptchaPanel).toBe(VaptchaPanel);
  expect(exports_.useInvisibleVaptcha).toBe(useInvisibleVaptcha);
  expect(exports_.verifyAndGetToken).toBe(verifyAndGetToken);
  expect(exports_.InitError).toBe(InitError);
  expect(exports_.VerifyClosed).toBe(VerifyClosed);
  expect(exports_.use).toBe(use);
});
