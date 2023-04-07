<!-- cSpell:words typeof -->

# 安装

## 使用包管理器

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

### 本项目依赖`@chongying-star/vaptcha-typescript`包（[🔗NPM](https://www.npmjs.com/package/@chongying-star/vaptcha-typescript)） 如果已经安装请跳过
::: code-group
```sh [npm]
$ npm install @chongying-star/vaptcha-typescript@>=1.0.0 --save
```
```sh [yarn]
$ yarn add @chongying-star/vaptcha-typescript@>=1.0.0
```
```sh [pnpm]
$ pnpm install @chongying-star/vaptcha-typescript@>=1.0.0
```
:::

## 全局注册组件

::: code-group
```ts [main.ts]
import { VaptchaButton, VaptchaPanel } from '@packages/index';
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
import { VaptchaButton, VaptchaPanel } from '@packages/index';
app.component('vaptcha-button', VaptchaButton);
app.component('vaptcha-panel', VaptchaPanel);
```
:::

## 设置全局默认选项

::: code-group
```ts [main.ts / main.js]
import { use } from '@chongying-star/vue-vaptcha';
use({
  vid: 'your vid ...',
  area: 'cn',
});
```
:::
