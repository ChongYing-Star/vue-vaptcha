import { createApp } from 'vue';
import App from './App.vue';
import { use } from '@packages/index';

use({
  vid: '59b252ed57f5a21114866a5d',
});

createApp(App).mount('#app');
