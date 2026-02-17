import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/dist', '**/node_modules'],
    passWithNoTests: true,
    globals: true,
    environment: 'node',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['json', 'html', 'text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['fixtures', 'src/types', '**/dist', '**/node_modules'],
    },
  },
});
