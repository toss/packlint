import { readJSON } from 'fs-extra';

import { PackageJSONPath, PackageJSONSchema } from '../models';

export async function getPackageJSON(path: PackageJSONPath) {
  const json = await readJSON(path);
  PackageJSONSchema.parse(json);

  return json;
}
