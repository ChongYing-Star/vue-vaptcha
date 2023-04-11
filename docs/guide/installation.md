<!-- cSpell:words typeof -->

# 安装

## 使用包管理器

*当前版本是测试版本，可能包含未发现的bug，API名称亦可能发生变动*

::: code-group
```sh [npm]
$ npm install @chongying-star/vue-vaptcha --save
```
```sh [yarn]
$ yarn add @chongying-star/vue-vaptcha
```
```sh [pnpm]
$ pnpm install @chongying-star/vue-vaptcha
```
:::

::: details 收到缺少Peer依赖的警告？

本项目依赖 `@chongying-star/vaptcha-typescript` 包（[🔗NPM](https://www.npmjs.com/package/@chongying-star/vaptcha-typescript)），部分情况下可能未被自动安装


```sh
$ npm install @chongying-star/vaptcha-typescript@>=1.0.0 --save
```
<br>

```sh
$ yarn add @chongying-star/vaptcha-typescript@>=1.0.0
```
<br>

```sh
$ pnpm install @chongying-star/vaptcha-typescript@>=1.0.0
```

:::

## （可选）全局注册组件

::: code-group
```ts [main.ts]
import '@chongying-star/vue-vaptcha/style.css';
import { VaptchaButton, VaptchaPanel } from '@chongying-star/vue-vaptcha';
app.component('vaptcha-button', VaptchaButton);
app.component('vaptcha-panel', VaptchaPanel);

// 全局注册组件类型
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    'vaptcha-button': typeof VaptchaButton,
    'vaptcha-panel': typeof VaptchaPanel,
  }
}
```
```js [main.js]
import '@chongying-star/vue-vaptcha/style.css';
import { VaptchaButton, VaptchaPanel } from '@chongying-star/vue-vaptcha';
app.component('vaptcha-button', VaptchaButton);
app.component('vaptcha-panel', VaptchaPanel);
```
:::

## （可选）设置全局默认选项

::: code-group
```ts [main.ts / main.js]
import { useDefaultOption } from '@chongying-star/vue-vaptcha';
useDefaultOption({
  vid: 'your vid ...',
  area: 'cn',
});
```
:::
