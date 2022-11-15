import { ConfigType, DEFAULT_ORDER, DefaultConfig, PackageJSONType } from '@packlint/core';
import { sort } from 'fast-sort';

import { createPriorityMap } from '../utils/createPriorityMap';

export function sortPackageJSON(packageJSON: PackageJSONType, context: ConfigType = DefaultConfig) {
  return sortObjectByKeys(packageJSON, { order: parsePackageJSONOrder(context), deep: context.deep });
}

export function parsePackageJSONOrder({ order = [] }: ConfigType) {
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

function sortObjectByKeys<T extends Record<string, unknown>>(
  obj: T,
  { order, deep = [] }: { order?: Array<keyof T>; deep?: Array<keyof T> } = {}
): T {
  return Object.fromEntries(
    sortByOrders(Object.keys(obj), order).map(key =>
      deep.includes(key) ? [key, sortObjectByKeys(obj[key] as Record<string, unknown>)] : [key, obj[key]]
    )
  );
}

function sortByOrders<T>(keys: Array<T>, order?: Array<T>) {
  if (order != null && order.length > 0) {
    const priority = createPriorityMap(order);
    return sort(keys).desc(key => priority.get(key) ?? 0);
  }

  return sort(keys).asc();
}
