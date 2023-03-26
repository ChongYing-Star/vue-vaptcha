<template>
  <div class="vue-vaptcha-panel" ref="element">
    <slot v-if="loading" name="loading">
      <div class="vue-vaptcha-panel-loading">
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
import { ref, shallowRef, onMounted, withDefaults } from 'vue';
import type { VaptchaServerToken, CyVaptcha } from '@chongying-star/vaptcha-typescript';

const props = withDefaults(defineProps<{
  vid: string,
  area?: 'auto' | 'sea' | 'na' | 'cn',
  lang?: 'auto' | 'zh-CN' | 'en' | 'zh-TW' | 'jp',
  scene?: number,
  guide?: boolean,
  modelValue?: string,
  server?: string,
  timeout?: number,
}>(), {
  timeout: 120 * 1000,
});

type Emits = {
  (e: 'update:modelValue', value: string): void,
  (e: 'update:server', value: string): void,
  (e: 'pass', value: VaptchaServerToken): void,
  (e: 'timeout'): void,
}
const emits = defineEmits<Emits>();

const element = ref<HTMLDivElement>();
const vaptchaObject = shallowRef<CyVaptcha>();
const timeoutId = ref<ReturnType<typeof setTimeout> >();
const loading = ref(true);

const setSeverToken = (value: VaptchaServerToken) => {
  emits('update:modelValue', value.token);
  emits('update:server', value.server);
};
const reset = () => {
  clearTimeout(timeoutId.value);
  vaptchaObject.value?.reset();
  setSeverToken({ server: '', token: '' });
};

onMounted(async () => {
  const { createVaptcha } = await import('@chongying-star/vaptcha-typescript');
  const vaptcha = await createVaptcha({
    container: element.value as HTMLDivElement,
    mode: 'embedded',
    vid: props.vid,
    area: props.area,
    lang: props.lang,
    scene: props.scene,
    guide: props.guide,
  });
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
  vaptchaObject.value = vaptcha;
});

defineExpose({
  reset,
  renderTokenInput: (...args: Parameters<CyVaptcha['renderTokenInput']>) => vaptchaObject.value?.renderTokenInput(...args),
});
</script>

<style>
.vue-vaptcha-panel {
  height: 230px;
}
.vue-vaptcha-panel-loading {
  height: 100%;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  color: #cccccc;
  padding: 0 16px;
  cursor: wait;
}
.vue-vaptcha-panel-loading>svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  margin-right: 8px;
}
</style>
