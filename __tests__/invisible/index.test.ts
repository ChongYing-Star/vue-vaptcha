import { test, expect } from 'vitest';

test('Exports', async () => {
  const [
    exports_,
    { InitError, VerifyClosed },
    { verifyAndGetToken },
    { useInvisibleVaptcha },
  ] = await Promise.all([
    import('@packages/invisible/index'),
    import('@packages/invisible/types'),
    import('@packages/invisible/verify-and-get-token'),
    import('@packages/invisible/use-invisible-vaptcha'),
  ]);
  expect(exports_.useInvisibleVaptcha).toBe(useInvisibleVaptcha);
  expect(exports_.verifyAndGetToken).toBe(verifyAndGetToken);
  expect(exports_.InitError).toBe(InitError);
  expect(exports_.VerifyClosed).toBe(VerifyClosed);
});
