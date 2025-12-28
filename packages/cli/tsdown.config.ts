import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts', './src/config.ts'],
  format: 'esm',
  clean: true,
  dts: true,
  banner: '#!/usr/bin/env node',
});
