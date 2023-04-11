import { defineConfig } from 'vitepress'; // cSpell:word vitepress

export default defineConfig({
  title: 'Vue Vaptcha',
  base: '/vue-vaptcha/',
  head: [
    [
      'script',
      { src: 'https://v-cn.vaptcha.com/v3.js' },
    ],
  ],
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/ChongYing-Star/vue-vaptcha/" }],
    nav: [
      {
        text: '1.0.0-beta.1',
        items: [
          { text: 'NPM', link: 'https://www.npmjs.com/package/@chongying-star/vue-vaptcha' },
          { text: 'Changelog', link: 'https://github.com/ChongYing-Star/vue-vaptcha/releases' },
        ],
      }
    ],
    sidebar: {
      "/guide/": [
        {
          text: '开始',
          items: [
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
          ],
        },
        {
          text: '组件',
          items: [
            { text: '按钮（点击式）', link: '/guide/button' },
            { text: '面板（嵌入式）', link: '/guide/panel' },
            { text: '隐藏式', link: '/guide/invisible' },
          ],
        },
      ],
    },
  },
});
