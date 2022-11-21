import { ConfigType, DefaultConfig, PackageJSONType } from '@packlint/core';
import { mergeDeepRight } from 'ramda';

export function mergePackageJSON(packageJSON: PackageJSONType, config: ConfigType = DefaultConfig) {
  /**
   * @see https://ramdajs.com/docs/#mergeDeepRight
   *
   * Creates a new object with the own properties of the first object merged with the own properties of the second object.
   * If a key exists in both objects:
   * a. and both values are objects, the two values will be recursively merged
   * b. otherwise the value from the second object will be used.
   */
  return mergeDeepRight(packageJSON, config.merge ?? {}) as PackageJSONType;
}
