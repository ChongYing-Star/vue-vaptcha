import { test, expect, vi, Mock, beforeEach } from 'vitest';
import { mount, shallowMount, flushPromises } from '@vue/test-utils';
import { nextTick, toRaw } from 'vue';
import { MockCyVaptcha } from '../MockCyVaptcha';
import { createVaptcha as $createVaptcha, CyVaptcha } from '@chongying-star/vaptcha-typescript';
import * as config from '@packages/config';
import Button from '@packages/vaptcha-button/src/vaptcha-button.vue';

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

/**
 * 组件测试的代码是与测试框架妥协后的产物，包括：
 * - 使用`any`对组件进行标注
 * - 使用`setTimeout`等待异步任务完成
 * 本人不才，希望如果有某位大神看到此处，能帮我修正一下
 */

test('Initialization', async () => {
  const wrapper = mount(Button as any, { props: { vid: 'test vid' } });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));

  expect(createVaptcha).toHaveBeenCalledOnce();
  expect(createVaptcha).toHaveBeenCalledWith({
    container: wrapper.element,
    mode: 'click',
    scene: undefined,
    vid: 'test vid',
  }, undefined, {
    immediateRender: true,
  });

  const vaptcha = createVaptcha.mock.results[0].value as MockCyVaptcha;
  const instance = wrapper.vm as InstanceType<typeof Button>;
  expect(toRaw(instance.vaptchaInstance)).toBe(vaptcha);
  expect(instance.reset).toBeTypeOf('function');
  expect(instance.validate).toBeTypeOf('function');
  expect(instance.renderTokenInput).toBeTypeOf('function');

  const consoleSpy = vi.spyOn(console, 'warn');
  instance.vaptchaInstance = undefined;
  expect(consoleSpy).toHaveBeenCalledOnce();
  expect(toRaw(instance.vaptchaInstance)).toBe(vaptcha);
  expect(consoleSpy.mock.calls[0][0]).toBe('[Vue warn] Set operation on key "value" failed: target is readonly.');

  await nextTick();
  expect(wrapper.find('.vue-vaptcha-button-loading').exists()).toBe(false);
});

test('Initialization should called vaptcha\'s methods', async () => {
  const vaptcha = new MockCyVaptcha();
  const listenSpy = vi.spyOn(vaptcha, 'listen');
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  shallowMount(Button as any, { props: { vid: 'test vid' } });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));
  expect(listenSpy).toHaveBeenCalledTimes(2);
  const passMethod = vaptcha.callbackMap.get('pass');
  const closeMethod = vaptcha.callbackMap.get('close');
  expect(listenSpy).toHaveBeenCalledWith('pass', passMethod);
  expect(listenSpy).toHaveBeenCalledWith('close', closeMethod);
});

test('Call expose methods', async () => {
  const vaptcha = new MockCyVaptcha();
  const resetSpy = vi.spyOn(vaptcha, 'reset');
  const validateSpy = vi.spyOn(vaptcha, 'validate');
  const renderTokenInputSpy = vi.spyOn(vaptcha, 'renderTokenInput');
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  const wrapper = shallowMount(Button as any, { props: { vid: 'test vid' } });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));

  const instance = wrapper.vm as InstanceType<typeof Button>;
  instance.reset();
  expect(resetSpy).toHaveBeenCalledOnce();
  instance.validate();
  expect(validateSpy).toHaveBeenCalledOnce();
  instance.renderTokenInput('#el');
  expect(renderTokenInputSpy).toHaveBeenCalledOnce();
  expect(renderTokenInputSpy).toHaveBeenCalledWith('#el');
});

test.each([
  { vid: 'test vid', timeout: 10 * 1000 },
  { vid: 'test vid', disabled: true },
  { disabled: false },
  { vid: 'test vid', scene: 1, disabled: false },
  { scene: 2, timeout: 30 * 1000 },
  { option: { lang: 'auto' } },
  { option: { vid: 'option vid' } },
  { option: { scene: 3 } },
])('Initialization with props: "%o"', async (props) => {
  const wrapper = shallowMount(Button as any, { props });
  expect(wrapper.props()).toEqual({
    timeout: 120000,
    disabled: false,
    ...props,
  });

  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));
  expect(createVaptcha).toHaveBeenCalledWith({
    container: wrapper.element,
    mode: 'click',
    vid: props.vid ?? props.option?.vid ?? '',
    scene: props.scene,
    ...props.option,
  }, undefined, {
    immediateRender: true,
  });
});

test.each([
  { vid: 'config vid' },
  { scene: 1 },
  { scene: 2, lang: 'auto' },
  { lang: 'auto' },
  { area: 'auto' },
])('Initialization with config: "%o"', async (defaultOption) => {
  ((config as any)['__optionGetterMock'] as Mock).mockReturnValue(defaultOption);
  const wrapper = shallowMount(Button as any);
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));
  expect(createVaptcha).toHaveBeenCalledWith({
    ...defaultOption,
    container: wrapper.element,
    mode: 'click',
    vid: defaultOption.vid ?? '',
  }, undefined, {
    immediateRender: true,
  });
});

test('Listen "close"', async () => {
  const wrapper = shallowMount(Button as any, { props: { vid: 'test vid' } });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));

  const vaptcha = createVaptcha.mock.results[0].value as MockCyVaptcha;
  vaptcha.callbackMap.get('close')?.();
  expect(wrapper.emitted('close')).toHaveLength(1);
});

test('Listen "pass"', async () => {
  const wrapper = shallowMount(Button as any, { props: { vid: 'test vid' } });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));

  const vaptcha = createVaptcha.mock.results[0].value as MockCyVaptcha;
  vaptcha.callbackMap.get('pass')?.();
  expect(wrapper.emitted('pass')).toHaveLength(1);
  expect(wrapper.emitted('pass')?.[0]).toEqual([vaptcha.getServerToken()]);
  expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([vaptcha.token]);
  expect(wrapper.emitted('update:server')).toHaveLength(1);
  expect(wrapper.emitted('update:server')?.[0]).toEqual([vaptcha.server]);
});

test('Timeout', async () => {
  const timeout = 60 * 1000;
  const wrapper = shallowMount(Button as any, { props: { vid: 'test vid', timeout } });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));

  try {
    vi.useFakeTimers();
    const vaptcha = createVaptcha.mock.results[0].value as MockCyVaptcha;
    const resetSpy = vi.spyOn(vaptcha, 'reset');
    vaptcha.callbackMap.get('pass')?.();

    vi.advanceTimersByTime(timeout - 1);
    expect(wrapper.emitted()).not.toHaveProperty('timeout');
    expect(resetSpy).not.toHaveBeenCalled();
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([vaptcha.token]);
    expect(wrapper.emitted('update:server')).toHaveLength(1);
    expect(wrapper.emitted('update:server')?.[0]).toEqual([vaptcha.server]);
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted()).toHaveProperty('timeout');
    expect(resetSpy).toHaveBeenCalled();
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['']);
    expect(wrapper.emitted('update:server')).toHaveLength(2);
    expect(wrapper.emitted('update:server')?.[1]).toEqual(['']);

    expect(wrapper.emitted('pass')).toHaveLength(1);
  } finally {
    vi.useRealTimers();
  }
});

test('Reset without timeout', async () => {
  const timeout = 60 * 1000;
  const wrapper = shallowMount(Button as any, { props: { vid: 'test vid', timeout } });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));

  try {
    vi.useFakeTimers();
    const vaptcha = createVaptcha.mock.results[0].value as MockCyVaptcha;
    const resetSpy = vi.spyOn(vaptcha, 'reset');
    vaptcha.callbackMap.get('pass')?.();

    vi.advanceTimersByTime(timeout / 2);
    expect(wrapper.emitted()).not.toHaveProperty('timeout');
    expect(resetSpy).not.toHaveBeenCalled();
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([vaptcha.token]);
    expect(wrapper.emitted('update:server')).toHaveLength(1);
    expect(wrapper.emitted('update:server')?.[0]).toEqual([vaptcha.server]);

    const timerCount = vi.getTimerCount();
    (wrapper.vm as InstanceType<typeof Button>).reset();
    expect(vi.getTimerCount()).toBe(timerCount - 1);

    expect(resetSpy).toHaveBeenCalled();
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['']);
    expect(wrapper.emitted('update:server')).toHaveLength(2);
    expect(wrapper.emitted('update:server')?.[1]).toEqual(['']);

    vi.advanceTimersByTime(timeout);
    vi.runAllTimers();
    expect(wrapper.emitted()).not.toHaveProperty('timeout');
    expect(wrapper.emitted('pass')).toHaveLength(1);
  } finally {
    vi.useRealTimers();
  }
});

test('When disabled', async () => {
  const wrapper = mount(Button as any, { props: { disabled: true } });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 50));
  await nextTick();
  expect(wrapper.classes()).toContain('is-disabled');
});
