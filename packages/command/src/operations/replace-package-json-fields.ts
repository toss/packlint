import { ConfigType, DefaultConfig, PackageJSONType } from '@packlint/core';
import { mergeRight } from 'ramda';

export function replacePackageJSONFields(packageJSON: PackageJSONType, config: ConfigType = DefaultConfig) {
  /**
   * @see https://ramdajs.com/docs/#mergeRight
   *
   * Create a new object with the own properties of the first object merged with the own properties of the second object.
   * If a key exists in both objects, the value from the second object will be used.
   */
  return mergeRight(packageJSON, config.replace ?? {});
}
