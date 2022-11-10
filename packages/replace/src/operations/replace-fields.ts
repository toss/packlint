import { ConfigType, DefaultConfig, PackageJSONType } from '@packlint/core';

export function replaceFields(packageJSON: PackageJSONType, { replace = {} }: ConfigType = DefaultConfig) {
  return Object.assign({ ...packageJSON }, replace);
}
