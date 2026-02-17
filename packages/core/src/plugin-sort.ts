import type { PackageJson } from 'type-fest';
import { definePlugin } from './define-plugin.js';
import type { Issue } from './types/issue.js';

export const sortPlugin = definePlugin((sortOrder: string[] = DEFAULT_SORT_ORDER) => ({
  name: 'packlint:sort',
  check({ packageJson }): Issue[] {
    const keys = Object.keys(packageJson);

    const specifiedKeys = sortOrder.filter(key => keys.includes(key));
    const restKeys = keys.filter(key => !sortOrder.includes(key));
    const sortedRestKeys = [...restKeys].sort((a, b) => a.localeCompare(b));

    const checkOrder = [...specifiedKeys, ...sortedRestKeys];

    const isSorted = keys.every((key, index) => key === checkOrder[index]);

    if (!isSorted) {
      return [
        {
          message: 'package.json keys are not sorted correctly.',
          fix: (packageJson): PackageJson => Object.fromEntries(checkOrder.map(key => [key, packageJson[key]])),
        },
      ];
    }

    return [];
  },
}));

export const DEFAULT_SORT_ORDER = [
  'name',
  'version',
  'private',
  'description',
  'keywords',
  'homepage',
  'bugs',
  'repository',
  'funding',
  'license',
  'author',
  'contributors',
  'sideEffects',
  'packageManager',
  'type',
  'exports',
  'main',
  'module',
  'browser',
  'types',
  'typings',
  'typesVersions',
  'bin',
  'man',
  'directories',
  'files',
  'workspaces',
  'scripts',
  'config',
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'bundledDependencies',
  'resolutions',
  'engines',
  'os',
  'cpu',
  'publishConfig',
];
