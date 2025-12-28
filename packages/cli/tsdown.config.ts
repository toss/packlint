import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: './src/run.ts',
    format: 'esm',
    banner: '#!/usr/bin/env node',
    noExternal: ['picocolors'],
  },
  {
    entry: './src/define-config.ts',
    format: 'esm',
    dts: true,
  },
]);
