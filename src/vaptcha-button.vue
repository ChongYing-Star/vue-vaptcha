<template>
  <div>
    <div>
      timeout: <input v-model="timeout" :min="0" :step="1" type="number"> ms
      <button @click="reset" >重置</button>
    </div>
    <div>
      <VaptchaButton
        v-model="token"
        v-model:server="server"
        :timeout="timeout"
        :disabled="disabled"
        @pass="onPass"
        @timeout="onTimeout"
        @close="onClose"
        ref="the"
      >
        button initializing
      </VaptchaButton>
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
import { ref } from 'vue';
import { VaptchaButton } from '@packages/index';
const timeout = ref(120 * 1000);
const server = ref('');
const token = ref('');
const the = ref<InstanceType<typeof VaptchaButton>>();
const disabled = ref(false);

const onPass = (...args: any[]) => console.log('onPass', ...args);
const onTimeout = (...args: any[]) => console.log('onTimeout', ...args);
const onClose = (...args: any[]) => console.log('onClose', ...args);

const reset = () => the.value?.reset();
</script>

<style scoped>
</style>
