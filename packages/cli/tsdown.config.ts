import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: './src/main.ts',
    format: 'esm',
    banner: '#!/usr/bin/env node',
    noExternal: ['@packlint/core'],
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
