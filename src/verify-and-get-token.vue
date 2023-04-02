<template>
  <div>
    <div>
    </div>
    <div>
      <button @click="validate">验证</button>
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
import { reactive, toRefs } from 'vue';
import { verifyAndGetToken, VaptchaServerToken } from '@packages/index';
const serverToken = reactive<VaptchaServerToken>({
  server: '',
  token: '',
});
const { server, token } = toRefs(serverToken);

async function validate () {
  const { server, token } = await verifyAndGetToken();
  serverToken.server = server;
  serverToken.token = token;
}
</script>

<style scoped>
</style>
