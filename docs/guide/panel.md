<script setup>
import { ref } from 'vue';
const token = ref(''), server = ref('');
</script>

# 面板（嵌入式）

## 使用方法

```vue
<template>
  <VaptchaPanel
    v-model="token"
    v-model:server="server"
    :vid="vid"
  />
</template>
<script setup>
import '@chongying-star/vue-vaptcha/style.css';
import { VaptchaPanel } from '@chongying-star/vue-vaptcha';

const vid = '...' // 使用你自己的vid
const token = ref(''), server = ref('');
</script>
```

## 预览

<AfterLibLoaded>
  <VaptchaPanel v-model="token" v-model:server="server" vid="59b252ed57f5a21114866a5d" style="max-width: 500px;" />
</AfterLibLoaded>

::: info Output:
token = "{{ token }}"

server = "{{ server }}"
:::

## Props

| Attribute | Description                   | Type                                        | Accepted Values | Default      |
| --------- | ----------------------------- | ------------------------------------------- | --------------- | ------------ |
| vid       | 验证单元的VID（**非响应式**） | `string?`                                   | --              | --           |
| scene     | 验证单元场景（**非响应式**）  | `number?`                                   | `0`~`6`         | --           |
| timeout   | Token过期时间（毫秒）         | `number?`                                   | --              | `120 * 1000` |
| disabled  | 禁用                          | `boolean?`                                  | --              | `false`      |
| option    | Vaptcha选项（**非响应式**）   | `Readonly<Partial<VaptchaOptionClickType>>` | --              | --           |

## Events

| Event name        | Description                              | Payloads                              |
| ----------------- | ---------------------------------------- | ------------------------------------- |
| update:modelValue | 更新token，可以使用`v-model`接收         | `[string]`                            |
| update:server     | 更新server，可以使用`v-model:server`接收 | `[string]`                            |
| pass              | 验证通过时触发                           | `[{ server: string, token: string }]` |
| timeout           | Token过期时触发                          | `[]`                                  |

## Slots

| Name    | Description            | Scope |
| ------- | ---------------------- | ----- |
| --      | 加载时显示的文本       | --    |
| loading | 自定义加载时显示的内容 | --    |

## Exposes

| Name             | Description                                                | Type                                                       |
| ---------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| vaptchaInstance  | vaptcha实例                                                | `ReadonlyShallowRef<CyVaptcha\|undefined>`                 |
| reset            | 重置                                                       | `() => void`                                               |
| renderTokenInput | 向表单添加名为`VAPTCHA_server`、`VAPTCHA_token`的input标签 | `(container?: string \| HTMLElement \| undefined) => void` |
