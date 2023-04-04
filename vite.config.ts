import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['packages/**/*'],
      copyDtsFiles: true,
    }),
  ],
  resolve: {
    alias: {
      '@packages': '/packages',
    },
  },
  server: {
    port: 7000,
  },
  build: {
    sourcemap: true,
    lib: {
      entry: './packages/index.ts',
      name: 'vue-vaptcha',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue', '@chongying-star/vaptcha-typescript'],
    },
  },
});
