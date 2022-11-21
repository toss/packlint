import { ConfigType, DefaultConfig, PackageJSONType } from '@packlint/core';
import * as R from 'ramda';

export function validateRequiredFields(packageJSON: PackageJSONType, { required = [] }: ConfigType = DefaultConfig) {
  const missingKeyInPackageJSON = R.complement(R.has(R.__, packageJSON));
  const missingFields = R.filter(missingKeyInPackageJSON)(required);

  if (missingFields.length > 0) {
    throw new Error(`Field ${missingFields.join(',')} are required, but not in package.json of ${packageJSON.name}`);
  }

  return packageJSON;
}
