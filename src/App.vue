<template>
  <div class="app-tabs">
    <span @click="tab = 'button'" class="app-tab">按钮（点击式）</span>
    <span @click="tab = 'panel'" class="app-tab">面板（嵌入式）</span>
    <span @click="tab = 'util'" class="app-tab">隐藏式（工具函数）</span>
    <span @click="tab = 'composables'" class="app-tab">隐藏式（组合函数）</span>
  </div>
  <div class="app-body" style="width: 500px;">
    <VaptchaButton v-if="tab === 'button'" />
    <VaptchaPanel v-if="tab === 'panel'" />
    <VerifyAndGetToken v-if="tab === 'util'" />
    <UseInvisibleVaptcha v-if="tab === 'composables'" />
  </div>
</template>

<script setup lang="ts">
import VaptchaButton from './vaptcha-button.vue';
import VaptchaPanel from './vaptcha-panel.vue';
import UseInvisibleVaptcha from './use-invisible-vaptcha.vue';
import VerifyAndGetToken from './verify-and-get-token.vue';
import { ref } from 'vue';

const tab = ref('button');
</script>

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  margin: 0;
}

#app {
  height: 100vh;
  overflow: auto;
}

.app-tabs {
  padding: 16px;
}

.app-tab {
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.app-tab:not(:last-child) {
  margin-right: 8px;
}

/* .app-body {
} */
</style>
