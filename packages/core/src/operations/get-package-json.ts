import fs from 'fs-extra';

import { PackageJSONPath, PackageJSONSchema } from '../models/index.js';

export async function getPackageJSON(path: PackageJSONPath) {
  const json = await fs.readJSON(path);

  return PackageJSONSchema.parse(json);
}
