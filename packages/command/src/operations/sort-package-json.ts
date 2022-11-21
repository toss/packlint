import { ConfigType, DEFAULT_ORDER, DefaultConfig, PackageJSONType } from '@packlint/core';
import * as R from 'ramda';

export function sortPackageJSON(packageJSON: PackageJSONType, config: ConfigType = DefaultConfig) {
  return sortObjectByKeys(packageJSON, {
    keys: parseOrderToPackageJSONKeys(config),
  });
}

export function parseOrderToPackageJSONKeys({ order = [] }: ConfigType) {
  const set = order.reduce<Set<keyof PackageJSONType>>((s, _key, i) => {
    const next = order[i + 1];

    if (_key !== '...') {
      s.delete(_key);
      s.add(_key);
      return s;
    }

    if (next === undefined) {
      throw new Error('... should not be the last item of order');
    }

    if (next === '...') {
      throw new Error('... should not be the next item of another ...');
    }

    const spreaded = DEFAULT_ORDER.slice(0, DEFAULT_ORDER.indexOf(next));
    spreaded.forEach(x => s.add(x));

    return s;
  }, new Set());

  DEFAULT_ORDER.forEach(x => set.add(x));

  return [...set];
}

/**
 * @example
 * target: {a: 1, b:2, c:3, d:4}
 * source: ['b','c']
 *
 * sortObjectByKeys(target, source) // {b:2, c:3, a:1. d:4}
 */
function sortObjectByKeys<T extends Record<string, unknown>>(
  obj: T,
  { keys = [] }: { keys?: Array<keyof T>; deep?: Array<keyof T> } = {}
): T {
  return R.pipe(
    sortByOrders(Object.keys(obj)),
    R.map((key: keyof T) => [
      key,
      /**
       * if value is an object, recursively sort value deep
       */
      isPureObject(obj[key]) ? sortObjectByKeys(obj[key] as Record<string, unknown>) : obj[key],
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
const sortByOrders = R.curry(_sortByOrders);
function _sortByOrders<T>(target: Array<T>, source: Array<T>) {
  /**
   * value not included in target is not needed
   */
  const _source = source.filter(key => target.includes(key));

  return R.pipe(R.sortBy(R.identity), R.concat(_source), R.uniq)(target);
}

function isPureObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && !Array.isArray(obj) && obj != null;
}
