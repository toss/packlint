import { readJSON } from 'fs-extra';

import { PackageJSONSchema } from '../models';

export async function getPackageJSON(dir: string) {
  const json = await readJSON(`${dir}/package.json`);

  return PackageJSONSchema.parse(json);
}
