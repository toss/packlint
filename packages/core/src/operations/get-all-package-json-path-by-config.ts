import fg from 'fast-glob';

import { parsePackageJSONPath } from '../models/index.js';
import { getConfig } from './get-config.js';

export async function getAllPackageJSONPathByConfig() {
  const { files = ['./package.json'], ignore = [] } = await getConfig();

  return fg(files.map(parsePackageJSONPath), {
    ignore: ignore.concat(['node_modules/**']),
  });
}
