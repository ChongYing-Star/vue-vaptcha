
import { test, expect, vi, Mock, beforeEach } from 'vitest';
import { MockCyVaptcha } from '../MockCyVaptcha';
import { createVaptcha as $createVaptcha, CyVaptcha } from '@chongying-star/vaptcha-typescript';
import * as config from '@packages/config';
import { InitError, VerifyClosed } from '@packages/invisible/types';
import { verifyAndGetToken } from '@packages/invisible/verify-and-get-token';


vi.mock('@packages/config', async () => {
  const module = (await vi.importActual('@packages/config')) as typeof import('@packages/config');
  (module as any)['__optionGetterMock'] = vi.spyOn(module, 'option', 'get').mockReturnValue({});
  return module;
});
beforeEach(() => ((config as any)['__optionGetterMock'] as Mock).mockReturnValue({}));

type C = typeof $createVaptcha;
const createVaptcha = vi.fn<Parameters<C>, ReturnType<C>>(() => Promise.resolve(new MockCyVaptcha() as unknown as CyVaptcha));
vi.doMock('@chongying-star/vaptcha-typescript', () => ({ createVaptcha }));
beforeEach(() => createVaptcha.mockRestore());


test('Verify then pass', async () => {
  const vaptcha = new MockCyVaptcha();
  const listenSpy = vi.spyOn(vaptcha, 'listen');
  const validateSpy = vi.spyOn(vaptcha, 'validate').mockImplementation(() => {
    vaptcha.callbackMap.get('pass')?.();
  });
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  const serverToken = await verifyAndGetToken({ vid: 'test vid' });
  expect(createVaptcha).toHaveBeenCalledOnce();
  expect(createVaptcha).toHaveBeenCalledWith({
    mode: 'invisible',
    vid: 'test vid',
  });
  expect(validateSpy).toHaveBeenCalledOnce();
  expect(listenSpy).toHaveBeenCalledTimes(2);
  const passMethod = vaptcha.callbackMap.get('pass');
  const closeMethod = vaptcha.callbackMap.get('close');
  expect(listenSpy).toHaveBeenCalledWith('pass', passMethod);
  expect(listenSpy).toHaveBeenCalledWith('close', closeMethod);
  expect(serverToken).toEqual(vaptcha.getServerToken());
});

test('Verify then close', async () => {
  const vaptcha = new MockCyVaptcha();
  const listenSpy = vi.spyOn(vaptcha, 'listen');
  const validateSpy = vi.spyOn(vaptcha, 'validate').mockImplementation(() => {
    vaptcha.callbackMap.get('close')?.();
  });
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);

  await expect(verifyAndGetToken({ vid: 'test vid' })).rejects.toBeInstanceOf(VerifyClosed);

  expect(createVaptcha).toHaveBeenCalledOnce();
  expect(createVaptcha).toHaveBeenCalledWith({
    mode: 'invisible',
    vid: 'test vid',
  });
  expect(validateSpy).toHaveBeenCalledOnce();
  expect(listenSpy).toHaveBeenCalledTimes(2);
  const passMethod = vaptcha.callbackMap.get('pass');
  const closeMethod = vaptcha.callbackMap.get('close');
  expect(listenSpy).toHaveBeenCalledWith('pass', passMethod);
  expect(listenSpy).toHaveBeenCalledWith('close', closeMethod);
});

test('Verify without vid', async () => {
  const vaptcha = new MockCyVaptcha();
  const listenSpy = vi.spyOn(vaptcha, 'listen');
  const validateSpy = vi.spyOn(vaptcha, 'validate');
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);

  await expect(verifyAndGetToken()).rejects.toBeInstanceOf(InitError);

  expect(createVaptcha).not.toHaveBeenCalled();
  expect(validateSpy).not.toHaveBeenCalled();
  expect(listenSpy).not.toHaveBeenCalled();
});

test.each([
  { vid: 'option vid' },
  { scene: 1 },
  { scene: 2, lang: 'auto' },
  { lang: 'auto' },
  { area: 'auto' },
])('Verify with option: "%o"', async (option) => {
  const vaptcha = new MockCyVaptcha();
  vi.spyOn(vaptcha, 'validate').mockImplementation(() => {
    vaptcha.callbackMap.get('pass')?.();
  });
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  await verifyAndGetToken({ vid: 'test vid', ...option } as any);
  expect(createVaptcha).toHaveBeenCalledOnce();
  expect(createVaptcha).toHaveBeenCalledWith({
    mode: 'invisible',
    vid: 'test vid',
    ...option,
  });
});

test.each([
  { vid: 'config vid' },
  { scene: 1 },
  { scene: 2, lang: 'auto' },
  { lang: 'auto' },
  { area: 'auto' },
])('Verify with config: "%o" and set option', async (defaultOption) => {
  ((config as any)['__optionGetterMock'] as Mock).mockReturnValue(defaultOption);
  const vaptcha = new MockCyVaptcha();
  vi.spyOn(vaptcha, 'validate').mockImplementation(() => {
    vaptcha.callbackMap.get('pass')?.();
  });
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  await verifyAndGetToken({ vid: 'test vid' } as any);
  expect(createVaptcha).toHaveBeenCalledOnce();
  expect(createVaptcha).toHaveBeenCalledWith({
    ...defaultOption,
    mode: 'invisible',
    vid: 'test vid',
  });
});

test.each([
  { vid: 'config vid' },
])('Verify with config: "%o" and not set option', async (defaultOption) => {
  ((config as any)['__optionGetterMock'] as Mock).mockReturnValue(defaultOption);
  const vaptcha = new MockCyVaptcha();
  vi.spyOn(vaptcha, 'validate').mockImplementation(() => {
    vaptcha.callbackMap.get('pass')?.();
  });
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  await verifyAndGetToken();
  expect(createVaptcha).toHaveBeenCalledOnce();
  expect(createVaptcha).toHaveBeenCalledWith({
    ...defaultOption,
    mode: 'invisible',
  });
});
