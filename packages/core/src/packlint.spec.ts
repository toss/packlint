import type { PackageJson } from 'type-fest';

import { packlint } from './packlint.js';
import { sortPlugin } from './plugin-sort.js';
import type { Plugin } from './types/plugin.js';

describe('packlint', () => {
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
