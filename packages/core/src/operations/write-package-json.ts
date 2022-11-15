import { writeJSON } from 'fs-extra';

import { PackageJSONPath, PackageJSONType } from '../index';

export function writePackageJSON(packgeJSON: PackageJSONType, path: PackageJSONPath) {
  return writeJSON(path, packgeJSON, { spaces: 2 });
}
