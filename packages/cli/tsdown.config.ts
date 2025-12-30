import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: './src/run.ts',
    format: 'esm',
    banner: '#!/usr/bin/env node',
    noExternal: ['picocolors', '@packlint/core'],
  },
  {
    entry: './src/config.ts',
    format: 'esm',
    dts: {
      resolve: ['@packlint/core'],
      resolver: 'tsc',
    },
    noExternal: ['@packlint/core'],
  },
]);
