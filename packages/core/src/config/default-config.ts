import type { PacklintConfig } from '../types/index.js';

export const DEFAULT_CONFIG: Required<PacklintConfig> = {
  files: ['**/package.json', '!**/node_modules/**/package.json'],
  sort: true,
  plugins: [],
};
