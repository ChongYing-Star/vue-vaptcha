<!-- cSpell:words instanceof composables -->

<script setup>
</script>

# 隐藏式

## 使用工具函数

### 使用方法

```javascript
import { verifyAndGetToken, VerifyClosed } from '@chongying-star/vue-vaptcha';
async function onFormSubmit () {
  try {
    const { server, token } = await verifyAndGetToken();
    // 验证成功
  } catch (error) {
    if (error instanceof VerifyClosed) {
      // 用户取消了验证
    }
  }
}
```

### Parameters

| Parameter | Description | Type                                            |
| --------- | ----------- | ----------------------------------------------- |
| option    | Vaptcha选项 | `Readonly<Partial<VaptchaOptionInvisibleType>>` |

### Return

| Property | Description | Type     |
| -------- | ----------- | -------- |
| token    | token值     | `string` |
| server   | server值    | `string` |

### Throws

| Type         | Description                                  |
| ------------ | -------------------------------------------- |
| InitError    | 初始化错误（通常是未提供vid）                |
| VerifyClosed | 用户取消了验证（通常是用户关闭了验证对话框） |



## 使用组合式函数（Composables）

### 使用方法

```javascript
import { useInvisibleVaptcha } from '@chongying-star/vue-vaptcha';

const timeout = ref(120 * 1000);

const {
  server, token, init, validate, reset,
} = useInvisibleVaptcha({
  timeout,
  onPass (serverToken) { console.log('passed', serverToken) },
});

onMounted(() => {
  init();
});

const onButtonClick = () => {
  validate();
};

watch(token, () => {
  // Do something ...
});
```

### Parameters

| Parameter | Property  | Description           | Type                          | Default      |
| --------- | --------- | --------------------- | ----------------------------- | ------------ |
| option    | timeout   | Token过期时间（毫秒） | `number\|Ref<number>`         | `120 * 1000` |
| option    | onPass    | 验证通过时触发        | `(VaptchaServerToken) => any` | --           |
| option    | onClose   | 关闭验证弹窗时触发    | `() => any`                   | --           |
| option    | onTimeout | Token过期时触发       | `() => any`                   | --           |

### Return

| Property         | Description                                                    | Type                                                                             |
| ---------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| vaptchaInstance  | vaptcha实例                                                    | `ReadonlyShallowRef<CyVaptcha\|undefined>`                                       |
| token            | 响应式token值                                                  | `ReadonlyRef<string>`                                                            |
| server           | 响应式server值                                                 | `ReadonlyRef<string>`                                                            |
| init             | 初始化方法                                                     | `(option?: Readonly<Partial<VaptchaOptionInvisibleType>>) => Promise<CyVaptcha>` |
| validate         | 开启验证方法                                                   | `() => void`                                                                     |
| reset            | 重置方法                                                       | `() => void`                                                                     |
| renderTokenInput | 向表单添加两个名为`VAPTCHA_server`、`VAPTCHA_token`的input标签 | `() => void`                                                                     |

### Throws

| Type      | Description                   |
| --------- | ----------------------------- |
| InitError | 初始化错误（通常是未提供vid） |
