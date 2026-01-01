import { createConsola } from 'consola';
import pkg from '../package.json' with { type: 'json' };

export const consola = createConsola({
  defaults: {
    tag: pkg.name,
  },
  formatOptions: {
    date: false,
  },
});
