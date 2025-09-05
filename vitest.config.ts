import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['shared/**/*.test.ts', 'shared/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@shared': './shared',
    },
  },
});
