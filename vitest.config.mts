import path from 'path';
import { defineConfig } from 'vitest/config';

const resolve = (src: string) => {
  return path.resolve(__dirname, src);
};

const isDist = process.env.LIB_DIR === 'dist';

export default defineConfig({
  resolve: {
    alias: isDist
      ? {
          '@chaomingd/design': resolve('./packages/design/dist/esm/index'),
          '@chaomingd/utils': resolve('./packages/utils/dist/esm/index'),
          '@chaomingd/hooks': resolve('./packages/hooks/dist/esm/index'),
        }
      : {
          '@chaomingd/design': resolve('./packages/design/src/index'),
          '@chaomingd/utils': resolve('./packages/utils/src/index'),
          '@chaomingd/hooks': resolve('./packages/hooks/src/index'),
        },
  },
  test: {
    environment: 'jsdom',
    include: ['./packages/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    reporters: ['default'],
    coverage: {
      include: ['packages/*/src/**/*.{tx,tsx}'],
      exclude: ['**/demos/*.tsx'],
      reporter: ['json-summary', ['text', { skipFull: true }], 'cobertura', 'html'],
    },
    testTimeout: 3e4,
  },
});
