<template>
  <div class="vue-vaptcha-button" :class="{ 'is-disabled': disabled }" ref="element">
    <slot v-if="loading" name="loading">
      <div class="vue-vaptcha-button-loading">
        <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="60px" viewBox="0 0 24 30">
          <rect x="0" y="9.22656" width="4" height="12.5469">
            <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="y" attributeType="XML" values="13;5;13" begin="0s" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x="10" y="5.22656" width="4" height="20.5469">
            <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="y" attributeType="XML" values="13;5;13" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x="20" y="8.77344" width="4" height="13.4531">
            <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="y" attributeType="XML" values="13;5;13" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          </rect>
        </svg>
        <slot>Vaptcha Initializing...</slot>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, shallowReadonly, onMounted, PropType } from 'vue';
import type { VaptchaServerToken, CyVaptcha, VaptchaOptionClickType } from '@chongying-star/vaptcha-typescript';
import { option as defaultOption } from '../../config';

const props = defineProps({
  vid: {
    type: String,
    validator (vid) {
      return typeof vid === 'string' || typeof defaultOption.vid === 'string' || typeof (this as any).option?.vid === 'string';
    },
  },
  scene: Number,
  option: Object as PropType<Readonly<Partial<VaptchaOptionClickType>>>,
  modelValue: String,
  server: String,
  timeout: {
    type: Number,
    default: 120 * 1000,
  },
  disabled: Boolean,
});

type Emits = {
  (e: 'update:modelValue', value: string): void,
  (e: 'update:server', value: string): void,
  (e: 'pass', value: VaptchaServerToken): void,
  (e: 'close'): void,
  (e: 'timeout'): void,
}
const emits = defineEmits<Emits>();

const element = shallowRef<HTMLDivElement>();
const __vaptchaInstance = shallowRef<CyVaptcha>();
const timeoutId = shallowRef<ReturnType<typeof setTimeout> >();
const loading = shallowRef(true);

const setSeverToken = (value: VaptchaServerToken) => {
  emits('update:modelValue', value.token);
  emits('update:server', value.server);
};
const reset = () => {
  clearTimeout(timeoutId.value);
  __vaptchaInstance.value?.reset();
  setSeverToken({ server: '', token: '' });
};

onMounted(async () => {
  const { createVaptcha } = await import('@chongying-star/vaptcha-typescript');
  const vaptcha = await createVaptcha({
    ...defaultOption,
    container: element.value as HTMLDivElement,
    mode: 'click',
    ...props.option,
    scene: props.scene ?? props.option?.scene ?? defaultOption.scene,
    vid: props.vid ?? props.option?.vid ?? defaultOption.vid ?? '',
  }, undefined, { immediateRender: true });
  loading.value = false;
  vaptcha.listen('pass', () => {
    const serverToken = { server: vaptcha.server, token: vaptcha.token };
    setSeverToken(serverToken);
    emits('pass', serverToken);
    timeoutId.value = setTimeout(() => {
      emits('timeout');
      reset();
    }, props.timeout);
  });
  vaptcha.listen('close', () => emits('close'));
  __vaptchaInstance.value = vaptcha;
});

const vaptchaInstance = shallowReadonly(__vaptchaInstance);
const validate = () => __vaptchaInstance.value?.validate();
const renderTokenInput = (...args: Parameters<CyVaptcha['renderTokenInput']>) => __vaptchaInstance.value?.renderTokenInput(...args);
defineExpose({
  vaptchaInstance,
  reset,
  validate,
  renderTokenInput,
});
</script>

<style>
.vue-vaptcha-button {
  height: 36px;
}
.vue-vaptcha-button-loading {
  height: 100%;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 1;
  color: #cccccc;
  padding: 0 16px;
  cursor: wait;
}
.vue-vaptcha-button-loading>svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  margin-right: 8px;
}

.vue-vaptcha-button.is-disabled {
  cursor: not-allowed;
}
.vue-vaptcha-button.is-disabled .vp-basic-btn {
  pointer-events: none;
  filter: grayscale(100%);
}

/* 修复右侧悬浮动画位置不准确的问题 */
.vue-vaptcha-button .vp-tip>.waves-animation {
  margin-left: 36px;
}
</style>
