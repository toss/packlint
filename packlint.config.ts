import { defineConfig } from 'packlint/config';

export default defineConfig({
  files: ['**/package.json', '!**/fixtures/**'],
  sort: true,
});
