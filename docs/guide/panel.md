<script setup>
</script>

# 面板（嵌入式）

## Props

| Attribute | Description                          | Type       | Accepted Values                  | Default      |
| --------- | ------------------------------------ | ---------- | -------------------------------- | ------------ |
| vid       | 验证单元的VID                        | `string`   | --                               | --           |
| scene     | 验证单元场景                         | `number?`  | --                               | 0            |
| lang      | 语言                                 | `string?`  | `auto` `zh-CN` `en` `zh-TW` `jp` | `auto`       |
| area      | 验证节点区域                         | `string?`  | `auto` `sea` `na` `cn`           | `auto`       |
| guide     | 是否在嵌入式图片底部显示操作提示文字 | `boolean?` | --                               | `false`      |
| timeout   | Token过期时间（毫秒）                | `number?`  | --                               | `120 * 1000` |

## Events

| Event Name        | Description                              | Payloads                              |
| ----------------- | ---------------------------------------- | ------------------------------------- |
| update:modelValue | 更新token，可以使用`v-model`接收         | `[string]`                            |
| update:server     | 更新server，可以使用`v-model:server`接收 | `[string]`                            |
| pass              | 验证通过时触发                           | `[{ server: string, token: string }]` |
| timeout           | Token过期时触发                          | `[]`                                  |

## Slots

| Name    | Description            | Scope |
| ------- | ---------------------- | ----- |
| --      | 加载时显示的文本       | `{}`  |
| loading | 自定义加载时显示的内容 | `{}`  |

## Methods

| Method           | Description                                                        | Parameters                         |
| ---------------- | ------------------------------------------------------------------ | ---------------------------------- |
| reset            | 重置                                                               | `[]`                               |
| renderTokenInput | 用于向表单添加两个名为`VAPTCHA_server`、`VAPTCHA_token`的input标签 | `[string\|HTMLElement\|undefined]` |
