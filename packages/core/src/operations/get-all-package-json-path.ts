import fg from 'fast-glob';

import { PackageJSONPathSchema } from '../index';
import { getConfig } from './get-config';

export async function getAllPackageJSONPath() {
  const { include = ['./packages/**'], exclude = [] } = await getConfig();

  return fg(
    include.map(x => PackageJSONPathSchema.parse(x)),
    {
      ignore: exclude.concat(['node_modules/**']),
    }
  );
}
