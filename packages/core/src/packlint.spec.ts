import type { PackageJson } from 'type-fest';
import { describe, expect, it } from 'vitest';

import { sortPlugin } from './plugin-sort.js';
import { packlint } from './packlint.js';
import type { Plugin } from './types/plugin.js';

describe('p acklint', () => {
  it('preserves fields created by previous plugin fixes', async () => {
    const addMainPlugin: Plugin = {
      name: 'add-main',
      check() {
        return [
          {
            code: 'add-main',
            message: 'add main field',
            fix(packageJson) {
              return { ...packageJson, main: './index.js' } as PackageJson;
            },
          },
        ];
      },
    };

    const targets = [
      {
        filepath: '/repo/package.json',
        content: {
          version: '1.0.0',
          name: 'packlint',
        } as PackageJson,
      },
    ];

    const [diagnostic] = await packlint(targets, { plugins: [addMainPlugin, sortPlugin()] });

    expect(diagnostic.output).toEqual({
      name: 'packlint',
      version: '1.0.0',
      main: './index.js',
    });
  });
});
