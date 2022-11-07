import { ConfigType, DEFAULT_ORDER, DefaultConfig, PackageJSONType } from '@packlint/core';
import { sort } from 'fast-sort';
import { match, P } from 'ts-pattern';

import { createPriorityMap } from '../utils/createPriorityMap';

export function sortPackageJSON(packageJSON: PackageJSONType, context: ConfigType = DefaultConfig) {
  return sortObjectByKeys(packageJSON, { order: parsePackageJSONOrder(context), deep: context.deep });
}

function parsePackageJSONOrder({ order = [] }: ConfigType) {
  const parsed = order.reduce<Array<keyof PackageJSONType>>((o, _key, i) => {
    return match([_key, order[i + 1]] as const)
      .with([P.not('...'), P._], ([key]) => [...o.filter(x => x !== key), key])
      .with(
        ['...', P.not('...')],
        ([, end]) => end !== undefined,
        ([, end]) => [...o, ...DEFAULT_ORDER.slice(0, DEFAULT_ORDER.indexOf(end))]
      )
      .otherwise(() => {
        throw new Error('use ... syntax correct way');
      });
  }, []);

  return [...new Set([...parsed, ...DEFAULT_ORDER])];
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
  if (order != null) {
    const priority = createPriorityMap(order);
    return sort(keys).desc(key => priority.get(key) ?? 0);
  }

  return sort(keys).asc();
}
``;
