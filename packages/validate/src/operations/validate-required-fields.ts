import { ConfigType, DefaultConfig, PackageJSONType } from '@packlint/core';

export async function validateRequiredFields(
  packageJSON: PackageJSONType,
  { required = [] }: ConfigType = DefaultConfig
) {
  const missingFields = required.filter(key => !(key in packageJSON));

  if (missingFields.length > 0) {
    throw new Error(`Field ${missingFields.join(',')} are required, but not in package.json of ${packageJSON.name}`);
  }
}
