import { writeJSON } from 'fs-extra';

import { PackageJSONType } from '../index';

export function writePackageJSON(packgeJSON: PackageJSONType, dir: string) {
  return writeJSON(`${dir}/package.json`, packgeJSON, { spaces: 2 });
}
