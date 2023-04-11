<script setup>
import { ref } from 'vue';
const token = ref(''), server = ref('');
</script>

# 按钮（点击式）

## 使用方法

```vue
<template>
  <VaptchaButton
    v-model="token"
    v-model:server="server"
    :vid="vid"
  />
</template>
<script setup>
import '@chongying-star/vue-vaptcha/style.css';
import { VaptchaButton } from '@chongying-star/vue-vaptcha';

const vid = '...'; // 使用你自己的vid
const token = ref(''), server = ref('');
</script>
```

## 预览

<AfterLibLoaded>
  <VaptchaButton v-model="token" v-model:server="server" vid="59b252ed57f5a21114866a5d" />
</AfterLibLoaded>

::: info Output:
token = "{{ token }}"

server = "{{ server }}"
:::

## Attributes

| Attribute | Description   | Type                                        | Accepted Values | Default |
| --------- | ------------- | ------------------------------------------- | --------------- | ------- |
| vid       | 验证单元的VID | `string?`                                   | --              | --      |
| scene     | 验证单元场景  | `number?`                                   | `0`~`6`         | --      |
| option    | Vaptcha选项   | `Readonly<Partial<VaptchaOptionClickType>>` | --              | --      |

## Props

| Prop     | Description           | Type       | Accepted Values | Default      |
| -------- | --------------------- | ---------- | --------------- | ------------ |
| timeout  | Token过期时间（毫秒） | `number?`  | --              | `120 * 1000` |
| disabled | 禁用                  | `boolean?` | --              | `false`      |

## Events

| Event name        | Description                              | Payloads                              |
| ----------------- | ---------------------------------------- | ------------------------------------- |
| update:modelValue | 更新token，可以使用`v-model`接收         | `[string]`                            |
| update:server     | 更新server，可以使用`v-model:server`接收 | `[string]`                            |
| pass              | 验证通过时触发                           | `[{ server: string, token: string }]` |
| close             | 关闭验证弹窗时触发                       | `[]`                                  |
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
| validate         | 触发验证                                                   | `() => void`                                               |
| renderTokenInput | 向表单添加名为`VAPTCHA_server`、`VAPTCHA_token`的input标签 | `(container?: string \| HTMLElement \| undefined) => void` |
