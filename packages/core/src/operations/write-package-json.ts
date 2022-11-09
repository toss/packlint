import { writeJSON } from 'fs-extra';

import { PackageJSONPathSchema, PackageJSONType } from '../index';

export function writePackageJSON(packgeJSON: PackageJSONType, path: string) {
  return writeJSON(PackageJSONPathSchema.parse(path), packgeJSON, { spaces: 2 });
}
