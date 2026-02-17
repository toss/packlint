import { describe, expect, it } from 'vitest';
import type { PackageJson } from './index.js';
import { packlint } from './packlint.js';
import type { Plugin } from './types/plugin.js';

function createTarget(content: PackageJson): { filepath: string; content: PackageJson } {
  return { filepath: 'package.json', content };
}

function mergePackageJson(packageJson: PackageJson, patch: Record<string, unknown>): PackageJson {
  return Object.assign({}, packageJson, patch) as PackageJson;
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe('packlint', () => {
  it('applies fixes in plugin order and reports each issue', async () => {
    let packageJsonSeenBySecondPlugin: PackageJson | undefined;

    const addNamePlugin: Plugin = {
      name: 'add-name',
      check: ({ packageJson }) => [
        {
          message: 'add name',
          fix: () => mergePackageJson(packageJson, { name: 'demo-package' }),
        },
      ],
    };

    const addVersionPlugin: Plugin = {
      name: 'add-version',
      check: ({ packageJson }) => {
        packageJsonSeenBySecondPlugin = packageJson;

        return [
          {
            message: 'add version',
            fix: () => mergePackageJson(packageJson, { version: '1.0.0' }),
          },
        ];
      },
    };

    const [diagnostic] = await packlint([createTarget({ private: true })], {
      plugins: [addNamePlugin, addVersionPlugin],
    });

    expect(packageJsonSeenBySecondPlugin).toEqual({ private: true, name: 'demo-package' });
    expect(diagnostic.output).toEqual({ private: true, name: 'demo-package', version: '1.0.0' });
    expect(diagnostic.issues).toEqual([
      { message: 'add name', fixable: true, fixed: true },
      { message: 'add version', fixable: true, fixed: true },
    ]);
  });

  it('tracks fixable and non-fixable issues separately', async () => {
    const plugin: Plugin = {
      name: 'mixed-issues',
      check: () => [
        { message: 'cannot auto-fix' },
        {
          message: 'fix returned undefined',
          fix: () => undefined,
        },
      ],
    };

    const [diagnostic] = await packlint([createTarget({ name: 'demo' })], { plugins: [plugin] });

    expect(diagnostic.output).toEqual({ name: 'demo' });
    expect(diagnostic.issues).toEqual([
      { message: 'cannot auto-fix', fixable: false, fixed: false },
      { message: 'fix returned undefined', fixable: true, fixed: false },
    ]);
  });

  it('supports async check and async fix', async () => {
    const plugin: Plugin = {
      name: 'async-plugin',
      check: async ({ packageJson }) => {
        await wait(10);
        return [
          {
            message: 'set type',
            fix: async (): Promise<PackageJson> => {
              await wait(10);
              return mergePackageJson(packageJson, { type: 'module' });
            },
          },
        ];
      },
    };

    const [diagnostic] = await packlint([createTarget({ name: 'demo' })], { plugins: [plugin] });

    expect(diagnostic.output).toEqual({ name: 'demo', type: 'module' });
    expect(diagnostic.issues).toEqual([{ message: 'set type', fixable: true, fixed: true }]);
  });

  it('keeps diagnostics in the same order as targets', async () => {
    const plugin: Plugin = {
      name: 'delayed-fix',
      check: async ({ filepath, packageJson }) => {
        if (filepath === 'b/package.json') {
          await wait(25);
        }

        return [
          {
            message: 'mark filepath',
            fix: () => mergePackageJson(packageJson, { name: filepath }),
          },
        ];
      },
    };

    const diagnostics = await packlint(
      [
        { filepath: 'a/package.json', content: {} },
        { filepath: 'b/package.json', content: {} },
      ],
      { plugins: [plugin] }
    );

    expect(diagnostics.map(diagnostic => diagnostic.filepath)).toEqual(['a/package.json', 'b/package.json']);
    expect(diagnostics.map(diagnostic => diagnostic.output.name)).toEqual(['a/package.json', 'b/package.json']);
  });
});
