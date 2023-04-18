import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'onFrame',
      fileName: 'on-frame',
    },
  },
  plugins: [dts()],
  test: {
    environment: 'jsdom',
    includeSource: ['src/**/*.{js,ts}'],
    coverage: {
      reporter: ['text'],
    },
  },
});
