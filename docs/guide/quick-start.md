# 快速开始

<script setup>
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
