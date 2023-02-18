<template>
  <div>
    <div>
      <VaptchaButton v-model="token" v-model:server="server" :timeout="30 * 1000" vid="59b252ed57f5a21114866a5d">hello</VaptchaButton>
    </div>
    <div>
      <VaptchaPanel vid="59b252ed57f5a21114866a5d" :timeout="10 * 1000" ref="panel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { VaptchaButton, VaptchaPanel } from '@packages/index';
const server = ref('');
const token = ref('');
const panel = ref<InstanceType<typeof VaptchaPanel> >();

watchEffect(() => {
  console.log(server.value, token.value);
});
</script>

<style scoped>
</style>
