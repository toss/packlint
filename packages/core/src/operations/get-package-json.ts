import { readJSON } from 'fs-extra';

import { PackageJSONPath, PackageJSONSchema } from '../models';

export async function getPackageJSON(path: PackageJSONPath) {
  const json = await readJSON(path);

  return PackageJSONSchema.parse(json);
}
