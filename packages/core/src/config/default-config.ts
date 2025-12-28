import { PacklintConfig } from './types.js';

export const defaultConfig = {
  files: ['**/package.json'],
  sort: true,
  plugins: [],
} satisfies PacklintConfig;
