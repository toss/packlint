import type { PackageJson } from 'type-fest';
import type { Plugin } from './types/index.js';

export const SORT_PLUGIN_NAME = 'packlint:sort';

export const sortPlugin = (sortOrder: string[] = DEFAULT_SORT_ORDER): Plugin => {
  return {
    name: SORT_PLUGIN_NAME,
    check({ packageJson }) {
      const keys = Object.keys(packageJson);

      const specifiedKeys = sortOrder.filter(key => keys.includes(key));
      const restKeys = keys.filter(key => !sortOrder.includes(key));

      const checkOrder = [...specifiedKeys, ...restKeys];

      const isSorted = keys.every((key, index) => key === checkOrder[index]);

      if (!isSorted) {
        const sortedRestKeys = [...restKeys].sort((a, b) => a.localeCompare(b));
        const fixOrder = [...specifiedKeys, ...sortedRestKeys];

        return [
          {
            code: 'require-sorted-keys',
            message: 'package.json keys are not sorted correctly.',
            fix: packageJson => Object.fromEntries(fixOrder.map(key => [key, packageJson[key]])) as PackageJson,
          },
        ];
      }

      return [];
    },
  };
};

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
