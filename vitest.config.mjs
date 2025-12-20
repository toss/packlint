import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: {
      inline: ['@packlint/core/testing'],
    },
    testTimeout: 10_000
  },
});
