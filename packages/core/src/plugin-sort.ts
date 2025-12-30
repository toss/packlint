import type { PackageJson } from 'type-fest';
import type { Plugin } from './types/index.js';

export const SORT_PLUGIN_NAME = 'packlint:sort';

// TODO: Implement custom sort order
export const sortPlugin = (sortOrder: string[] = DEFAULT_SORT_ORDER): Plugin => {
  /**
   * Sorting algorithm:
   * 1. Sort specified keys
   * 2. Sort rest keys in alphabetically
   */
  const getOrder = (currentKeys: string[]) => {
    const sortedSpecified = sortOrder.filter(key => currentKeys.includes(key));
    const rest = currentKeys.filter(key => !sortOrder.includes(key)).sort((a, b) => a.localeCompare(b));

    return [...sortedSpecified, ...rest];
  };

  return {
    name: SORT_PLUGIN_NAME,
    rules: [
      {
        name: `${SORT_PLUGIN_NAME}:package-json-sorted`,
        check({ data, filepath }) {
          const keys = Object.keys(data);
          const targetOrder = getOrder(keys);

          const isSorted = keys.every((key, i) => key === targetOrder[i]);

          if (!isSorted) {
            return [
              {
                message: 'package.json keys are not sorted.',
                filepath,
                fixable: true,
              },
            ];
          }

          return [];
        },
        fix({ data }) {
          const keys = Object.keys(data);
          const targetOrder = getOrder(keys);

          if (!targetOrder) return data;

          return Object.fromEntries(targetOrder.map(key => [key, data[key]])) as PackageJson;
        },
      },
    ],
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
