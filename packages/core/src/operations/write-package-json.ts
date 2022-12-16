import fs from 'fs-extra';

import { PackageJSONPath, PackageJSONType } from '../index.js';

export function writePackageJSON(packgeJSON: PackageJSONType, path: PackageJSONPath) {
  return fs.writeJSON(path, packgeJSON, { spaces: 2 });
}
