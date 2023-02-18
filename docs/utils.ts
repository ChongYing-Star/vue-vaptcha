import { defineComponent, ref, onMounted } from 'vue';

export const libSrc = 'https://v-cn.vaptcha.com/v3.js';

export async function loadLibScript (src: string = libSrc) {
  let script: HTMLScriptElement|null = document.querySelector(`script[src='${src}']`);
  if (script === undefined || script === null) {
    script = document.createElement('script');
    script.src = src;
  }
  if (typeof (<any>window).vaptcha !== 'function') {
    return new Promise((resolve, reject) => {
      script?.addEventListener('load', () => resolve(script));
      script?.addEventListener('error', reject);
    });
  }
  return script;
}

export const AfterLibLoaded = defineComponent({
  setup (_props, { slots }) {
    const libLoaded = ref(false);
    onMounted(() => {
      loadLibScript().then(() => libLoaded.value = true);
    });
    return () => {
      if (libLoaded.value) {
        return slots.default?.();
      } else {
        return;
      }
    };
  },
});
