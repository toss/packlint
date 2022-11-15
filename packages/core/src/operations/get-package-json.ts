import { readJSON } from 'fs-extra';

import { PackageJSONPath, PackageJSONSchema } from '../models';

export async function getPackageJSON(path: PackageJSONPath) {
  return readJSON(path).then(PackageJSONSchema.parse);
}
