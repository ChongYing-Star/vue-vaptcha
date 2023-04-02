<template>
  <div>
    <div>
      timeout: <input v-model="timeout" :min="0" :step="1" type="number"> ms
      <button @click="reset" >重置</button>
    </div>
    <div>
      <button @click="validate" :disabled="!!token && !vaptchaInstance">验证</button>
    </div>
    <div>
      server: {{ server }}
    </div>
    <div>
      token: {{ token }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useInvisibleVaptcha } from '@packages/index';
const timeout = ref(120 * 1000);

const onPass = (...args: any[]) => console.log('onPass', ...args);
const onTimeout = (...args: any[]) => console.log('onTimeout', ...args);
const onClose = (...args: any[]) => console.log('onClose', ...args);

const { server, token, init, validate, reset, vaptchaInstance } = useInvisibleVaptcha({
  timeout, onPass, onTimeout, onClose,
});

onMounted(() => init());
</script>

<style scoped>
</style>
