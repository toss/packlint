import { ConfigType, DEFAULT_ORDER, DefaultConfig, PackageJSONType } from '@packlint/core';
import * as R from 'ramda';

export function sortPackageJSON(packageJSON: PackageJSONType, config: ConfigType = DefaultConfig) {
  return sortObjectByKeyOrders(packageJSON, {
    keys: R.uniq([...(config.rules?.order ?? []), ...DEFAULT_ORDER]),
    deep: ['dependencies', 'devDependencies', 'peerDependencies', 'peerDependenciesMeta', 'resolutions', 'scripts'],
  });
}

/**
 * @example
 * target: {a: 1, b:2, c:3, d:4}
 * source: ['b','c']
 *
 * sortObjectByKeys(target, source) // {b:2, c:3, a:1. d:4}
 */
function sortObjectByKeyOrders<T extends Record<string, unknown>>(
  obj: T,
  { keys = [], deep = [] }: { keys?: string[]; deep?: string[] } = {}
) {
  return R.pipe(
    sortByOrders(Object.keys(obj)),
    R.map(key => [
      key,
      /**
       * if value is an object, recursively sort value deep
       */
      isPureObject(obj[key]) && deep.includes(key)
        ? sortObjectByKeyOrders(obj[key] as Record<string, unknown>)
        : obj[key],
    ]),
    Object.fromEntries
  )(keys);
}

/**
 * @example
 * target: [2,1,3,4]
 * source: [3,2]
 *
 * sortByOrders(target, source) // [3,2,1,4]
 */

function sortByOrders<T>(target: Array<T>) {
  return function (source: Array<T>): Array<T> {
    /**
     * value not included in target is not needed
     */
    const _source = source.filter(key => target.includes(key));

    return R.pipe(R.sortBy(R.identity), R.concat(_source), R.uniq)(target);
  };
}

function isPureObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && !Array.isArray(obj) && obj != null;
}
