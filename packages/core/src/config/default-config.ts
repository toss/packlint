import { PacklintConfig } from '../types/index.js';

export const DEFAULT_CONFIG: Required<PacklintConfig> = {
  files: ['**/package.json'],
  sort: true,
  plugins: [],
};
