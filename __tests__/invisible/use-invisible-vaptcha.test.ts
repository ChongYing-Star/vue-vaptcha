import { test, expect, vi, Mock, beforeEach } from 'vitest';
import { isRef, isReadonly } from 'vue';
import { MockCyVaptcha } from '../MockCyVaptcha';
import { createVaptcha as $createVaptcha, CyVaptcha } from '@chongying-star/vaptcha-typescript';
import * as config from '@packages/config';
import { InitError } from '@packages/invisible/types';
import { useInvisibleVaptcha } from '@packages/invisible/use-invisible-vaptcha';

type C = typeof $createVaptcha;

vi.mock('@packages/config', async () => {
  const module = (await vi.importActual('@packages/config')) as typeof import('@packages/config');
  (module as any)['__optionGetterMock'] = vi.spyOn(module, 'option', 'get').mockReturnValue({});
  return module;
});
beforeEach(() => ((config as any)['__optionGetterMock'] as Mock).mockReturnValue({}));

const createVaptcha = vi.fn<Parameters<C>, ReturnType<C>>(() => Promise.resolve(new MockCyVaptcha() as unknown as CyVaptcha));
vi.doMock('@chongying-star/vaptcha-typescript', () => ({ createVaptcha }));
beforeEach(() => createVaptcha.mockRestore());

test('Use and initialization', async () => {
  const {
    init, server, token, vaptchaInstance,
    reset, validate, renderTokenInput,
  } = useInvisibleVaptcha();

  expect(isRef(vaptchaInstance)).toBe(true);
  expect(isReadonly(vaptchaInstance)).toBe(true);
  expect(isRef(server)).toBe(true);
  expect(isReadonly(server)).toBe(true);
  expect(isRef(token)).toBe(true);
  expect(isReadonly(token)).toBe(true);
  expect(reset).toBeTypeOf('function');
  expect(validate).toBeTypeOf('function');
  expect(renderTokenInput).toBeTypeOf('function');

  const v = await init({ vid: 'test vid' });
  expect(createVaptcha).toHaveBeenCalledOnce();
  expect(createVaptcha).toHaveBeenCalledWith({
    mode: 'invisible',
    vid: 'test vid',
  });

  const vaptcha = createVaptcha.mock.results[0].value as MockCyVaptcha;
  expect(vaptchaInstance.value).toBe(vaptcha);
  expect(vaptchaInstance.value).toBe(v);
  expect(v).toBe(vaptcha);
});

test('Initialization without vid', async () => {
  const vaptcha = new MockCyVaptcha();
  const listenSpy = vi.spyOn(vaptcha, 'listen');
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  const {
    init,
  } = useInvisibleVaptcha();
  await expect(init()).rejects.toBeInstanceOf(InitError);
  expect(createVaptcha).not.toHaveBeenCalled();
  expect(listenSpy).not.toHaveBeenCalled();
});

test('Initialization should called vaptcha\'s methods', async () => {
  const vaptcha = new MockCyVaptcha();
  const listenSpy = vi.spyOn(vaptcha, 'listen');
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  const {
    init,
  } = useInvisibleVaptcha();
  await init({ vid: 'test vid' });

  expect(listenSpy).toHaveBeenCalledTimes(2);
  const passMethod = vaptcha.callbackMap.get('pass');
  const closeMethod = vaptcha.callbackMap.get('close');
  expect(listenSpy).toHaveBeenCalledWith('pass', passMethod);
  expect(listenSpy).toHaveBeenCalledWith('close', closeMethod);
});

test('Call returned methods', async () => {
  const {
    init,
    reset, validate, renderTokenInput,
  } = useInvisibleVaptcha();
  const vaptcha = await init({ vid: 'test vid' });

  const resetSpy = vi.spyOn(vaptcha, 'reset');
  const validateSpy = vi.spyOn(vaptcha, 'validate');
  const renderTokenInputSpy = vi.spyOn(vaptcha, 'renderTokenInput');
  reset();
  expect(resetSpy).toHaveBeenCalledOnce();
  validate();
  expect(validateSpy).toHaveBeenCalledOnce();
  renderTokenInput('#el');
  expect(renderTokenInputSpy).toHaveBeenCalledOnce();
  expect(renderTokenInputSpy).toHaveBeenCalledWith('#el');
});

test.each([
  { timeout: 10 * 1000 },
  { disabled: true },
  { disabled: false },
  { scene: 1, disabled: false },
  { scene: 2, timeout: 30 * 1000 },
  { option: { lang: 'auto' } },
  { option: { vid: 'option vid' } },
  { option: { scene: 3 } },
])('Initialization with option: "%o"', async (option) => {
  const {
    init,
  } = useInvisibleVaptcha();
  await init({ vid: 'test vid', ...option });

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
])('Initialization with config: "%o" and set option', async (defaultOption) => {
  ((config as any)['__optionGetterMock'] as Mock).mockReturnValue(defaultOption);
  const {
    init,
  } = useInvisibleVaptcha();
  await init({ vid: 'test vid' });

  expect(createVaptcha).toHaveBeenCalledWith({
    ...defaultOption,
    vid: 'test vid',
    mode: 'invisible',
  });
});

test.each([
  { vid: 'config vid' },
])('Initialization with config: "%o" and not set option', async (defaultOption) => {
  ((config as any)['__optionGetterMock'] as Mock).mockReturnValue(defaultOption);
  const {
    init,
  } = useInvisibleVaptcha();
  await init();

  expect(createVaptcha).toHaveBeenCalledWith({
    ...defaultOption,
    mode: 'invisible',
  });
});

test('Listen "close"', async () => {
  const onClose = vi.fn();
  const {
    init,
  } = useInvisibleVaptcha({
    onClose,
  });
  const vaptcha = await init({ vid: 'test vid' }) as unknown as MockCyVaptcha;
  vaptcha.callbackMap.get('close')?.();
  expect(onClose).toHaveBeenCalledOnce();
});

test('Listen "pass"', async () => {
  const onPass = vi.fn();
  const {
    init, server, token,
  } = useInvisibleVaptcha({
    onPass,
  });
  const vaptcha = await init({ vid: 'test vid' }) as unknown as MockCyVaptcha;
  expect(server.value).toBe('');
  expect(token.value).toBe('');
  vaptcha.callbackMap.get('pass')?.();
  expect(onPass).toHaveBeenCalledOnce();
  expect(onPass).toHaveBeenCalledWith(vaptcha.getServerToken());
  expect(server.value).toBe(vaptcha.server);
  expect(token.value).toBe(vaptcha.token);
});

test.each([60, 120])('Timeout = %ds', async (seconds) => {
  const timeout = seconds * 1000;
  const onTimeout = vi.fn();
  const onPass = vi.fn();
  const {
    init, server, token,
  } = useInvisibleVaptcha({
    timeout,
    onTimeout,
    onPass,
  });
  const vaptcha = await init({ vid: 'test vid' }) as unknown as MockCyVaptcha;

  try {
    vi.useFakeTimers();
    const resetSpy = vi.spyOn(vaptcha, 'reset');
    expect(server.value).toBe('');
    expect(token.value).toBe('');
    vaptcha.callbackMap.get('pass')?.();

    vi.advanceTimersByTime(timeout - 1);
    expect(onTimeout).not.toHaveBeenCalledOnce();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(server.value).toBe(vaptcha.server);
    expect(token.value).toBe(vaptcha.token);
    vi.advanceTimersByTime(1);
    expect(onTimeout).toHaveBeenCalledOnce();
    expect(resetSpy).toHaveBeenCalled();
    expect(server.value).toBe('');
    expect(token.value).toBe('');

    expect(onPass).toHaveBeenCalledOnce();
  } finally {
    vi.useRealTimers();
  }
});

test('Reset without timeout', async () => {
  const timeout = 60 * 1000;
  const onTimeout = vi.fn();
  const onPass = vi.fn();
  const {
    init, server, token,
    reset,
  } = useInvisibleVaptcha({
    timeout,
    onTimeout,
    onPass,
  });
  const vaptcha = await init({ vid: 'test vid' }) as unknown as MockCyVaptcha;

  try {
    vi.useFakeTimers();
    const resetSpy = vi.spyOn(vaptcha, 'reset');
    expect(server.value).toBe('');
    expect(token.value).toBe('');
    vaptcha.callbackMap.get('pass')?.();

    vi.advanceTimersByTime(timeout / 2);
    expect(onTimeout).not.toHaveBeenCalledOnce();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(server.value).toBe(vaptcha.server);
    expect(token.value).toBe(vaptcha.token);

    const timerCount = vi.getTimerCount();
    reset();
    expect(vi.getTimerCount()).toBe(timerCount - 1);

    expect(resetSpy).toHaveBeenCalled();
    expect(server.value).toBe('');
    expect(token.value).toBe('');

    vi.advanceTimersByTime(timeout);
    vi.runAllTimers();
    expect(onTimeout).not.toHaveBeenCalledOnce();
    expect(onPass).toHaveBeenCalledOnce();
  } finally {
    vi.useRealTimers();
  }
});
