import fg from 'fast-glob';

import { parsePackageJSONPath } from '../models/index.js';
import { getConfig } from './get-config.js';

export async function getAllPackageJSONPathByConfig() {
  const { files = ['./package.json'], ignores = [] } = await getConfig();

  return fg(files.map(parsePackageJSONPath), {
    ignore: ignores.concat(['node_modules/**']),
  });
}
