import { test, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick, toRaw, isReadonly } from 'vue';
import { MockCyVaptcha } from '../MockCyVaptcha';
import { createVaptcha as $createVaptcha, CyVaptcha } from '@chongying-star/vaptcha-typescript';
import Button from '@packages/vaptcha-button/src/vaptcha-button.vue';

type C = typeof $createVaptcha;

const createVaptcha = vi.fn<Parameters<C>, ReturnType<C>>();
vi.doMock('@chongying-star/vaptcha-typescript', () => ({ createVaptcha }));

/**
 * 组件的代码是与测试框架妥协后的产物，包括：
 * - 使用`any`对组件进行标注
 * - 使用`setTimeout`等待异步任务完成
 * 本人不才，希望如果有某位大神看到此处，能帮我修正一下
 */

test('Initialization', async () => {
  let vaptcha: MockCyVaptcha|undefined = undefined;
  createVaptcha.mockImplementationOnce((option) => {
    vaptcha = new MockCyVaptcha(option);
    return Promise.resolve(vaptcha as unknown as CyVaptcha);
  });
  const wrapper = mount(Button as any, { props: { vid: 'test vid' } });
  await flushPromises();
  await nextTick();
  await await new Promise((r) => setTimeout(r, 50));

  expect(createVaptcha).toHaveBeenCalledOnce();
  expect(createVaptcha).toHaveBeenCalledWith({
    container: wrapper.element,
    mode: 'click',
    scene: undefined,
    vid: 'test vid',
  }, undefined, {
    immediateRender: true,
  });
  await await new Promise((r) => setTimeout(r, 50));
  expect(vaptcha).toBeDefined();

  const instance = wrapper.vm as InstanceType<typeof Button>;
  expect(toRaw(instance.vaptchaInstance)).toBe(vaptcha);
  expect(isReadonly(instance.vaptchaInstance)).toBe(true);
  expect(instance.reset).toBeTypeOf('function');
  expect(instance.validate).toBeTypeOf('function');
  expect(instance.renderTokenInput).toBeTypeOf('function');

  expect(wrapper.find('.vue-vaptcha-panel-loading').exists()).toBe(false);
});

test('Initialization should called vaptcha\'s methods', async () => {
  const vaptcha = new MockCyVaptcha();
  const listenSpy = vi.spyOn(vaptcha, 'listen');
  createVaptcha.mockResolvedValueOnce(vaptcha as unknown as CyVaptcha);
  mount(Button as any, { props: { vid: 'test vid' } });
  await flushPromises();
  await await new Promise((r) => setTimeout(r, 50));
  expect(listenSpy).toHaveBeenCalledTimes(2);
  const passMethod = vaptcha.callbackMap.get('pass');
  const closeMethod = vaptcha.callbackMap.get('close');
  expect(listenSpy).toHaveBeenCalledWith('pass', passMethod);
  expect(listenSpy).toHaveBeenCalledWith('close', closeMethod);
});
