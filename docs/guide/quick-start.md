# 快速开始

<script setup>
import { ref, nextTick } from 'vue';
const button_token = ref(''), button_server = ref('');
const panel_token = ref(''), panel_server = ref('');
</script>

## 使用点击式

```vue
<template>
  <VaptchaButton
    v-model="token"
    v-model:server="server"
    vid="59b252ed57f5a21114866a5d"
  />
</template>
<script setup>
import '@chongying-star/vue-vaptcha/style.css';
import { VaptchaButton } from '@chongying-star/vue-vaptcha';
const token = ref(''), server = ref('');
</script>
```
<AfterLibLoaded>
  <VaptchaButton v-model="button_token" v-model:server="button_server" vid="59b252ed57f5a21114866a5d" />
</AfterLibLoaded>

::: info 输出
token = "{{ button_token }}"

server = "{{ button_server }}"
:::


## 使用嵌入式

```vue
<template>
  <VaptchaPanel
    v-model="token"
    v-model:server="server"
    vid="59b252ed57f5a21114866a5d"
  />
</template>
<script setup>
import '@chongying-star/vue-vaptcha/style.css';
import { VaptchaPanel } from '@chongying-star/vue-vaptcha';
const token = ref(''), server = ref('');
</script>
```
<AfterLibLoaded>
  <VaptchaPanel v-model="panel_token" v-model:server="panel_server" vid="59b252ed57f5a21114866a5d" />
</AfterLibLoaded>

::: info 输出
token = "{{ panel_token }}"

server = "{{ panel_server }}"
:::
