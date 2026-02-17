import type { PackageJson } from 'type-fest';
import { describe, expect, it } from 'vitest';
import { packlint } from '../packlint.js';
import type { Plugin } from '../types/plugin.js';
import { resolveConfig } from './resolve-config.js';

function createTarget(content: PackageJson): { filepath: string; content: PackageJson } {
  return { filepath: 'package.json', content };
}

describe('resolveConfig', () => {
  it('returns default files and enables built-in sort plugin', async () => {
    const config = resolveConfig();
    const [diagnostic] = await packlint([createTarget({ version: '1.0.0', name: 'demo' })], { plugins: config.plugins });

    expect(config.files).toEqual(['**/package.json', '!**/node_modules/**/package.json']);
    expect(config.sort).toBe(true);
    expect(config.plugins).toHaveLength(1);
    expect(Object.keys(diagnostic.output)).toEqual(['name', 'version']);
  });

  it('disables built-in sort plugin when sort is false', async () => {
    const addVersionPlugin: Plugin = {
      name: 'add-version',
      check: () => [
        {
          message: 'add version',
          fix: () => ({ version: '1.0.0' }),
        },
      ],
    };
    const config = resolveConfig({ sort: false, plugins: [addVersionPlugin] });
    const [diagnostic] = await packlint([createTarget({ name: 'demo' })], { plugins: config.plugins });

    expect(config.plugins).toEqual([addVersionPlugin]);
    expect(diagnostic.output).toEqual({ version: '1.0.0' });
  });

  it('uses custom sort order when sort is an array', async () => {
    const config = resolveConfig({ sort: ['description', 'name', 'version'] });
    const [diagnostic] = await packlint(
      [
        createTarget({
          version: '1.0.0',
          name: 'demo',
          description: 'custom order',
          scripts: { build: 'tsc' },
          dependencies: { zod: '^3.0.0' },
        }),
      ],
      { plugins: config.plugins }
    );

    expect(Object.keys(diagnostic.output)).toEqual(['description', 'name', 'version', 'dependencies', 'scripts']);
  });

  it('appends built-in sort plugin after user plugins', async () => {
    const buildUnsortedPackagePlugin: Plugin = {
      name: 'build-unsorted',
      check: () => [
        {
          message: 'build unsorted package',
          fix: () => ({ version: '1.0.0', name: 'demo' }),
        },
      ],
    };
    const config = resolveConfig({ plugins: [buildUnsortedPackagePlugin] });
    const [diagnostic] = await packlint([createTarget({})], { plugins: config.plugins });

    expect(Object.keys(diagnostic.output)).toEqual(['name', 'version']);
    expect(diagnostic.issues).toEqual([
      { message: 'build unsorted package', fixable: true, fixed: true },
      { message: 'package.json keys are not sorted correctly.', fixable: true, fixed: true },
    ]);
  });
});
