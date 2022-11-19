import { ConfigType, DefaultConfig, PackageJSONType } from '@packlint/core';

export function mergePackageJSON(packageJSON: PackageJSONType, { merge: _merge = {} }: ConfigType = DefaultConfig) {
  return merge(packageJSON, _merge);
}

function merge<K extends string, T extends Record<K, unknown>>(target: T, source: T): T {
  return Object.keys(source).reduce(
    (acc, _key) => {
      /** @note this is for type assertion */
      const key = _key as K;
      const targetVal = target[key];
      const sourceVal = source[key];

      if (isPureObject(targetVal) && isPureObject(sourceVal)) {
        acc[key] = merge(targetVal, sourceVal);
      } else {
        acc[key] = source[key];
      }
      return acc;
    },
    { ...target } as T
  );
}

export function isPureObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && !Array.isArray(obj) && obj != null;
}
