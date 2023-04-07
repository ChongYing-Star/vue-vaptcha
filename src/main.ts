import { createApp } from 'vue';
import App from './App.vue';
import { use } from '@packages/index';
// import { VaptchaButton, VaptchaPanel } from '@packages/index';

use({
  vid: '59b252ed57f5a21114866a5d',
});

const app = createApp(App);
app.mount('#app');

// app.component('vaptcha-button', VaptchaButton);
// app.component('vaptcha-panel', VaptchaPanel);
// declare module '@vue/runtime-core' {
//   export interface GlobalComponents {
//     'vaptcha-button': typeof VaptchaButton,
//     'vaptcha-panel': typeof VaptchaPanel,
//   }
// }
