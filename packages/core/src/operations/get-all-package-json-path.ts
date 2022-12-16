import fg from 'fast-glob';

import { parsePackageJSONPath } from '../models/index.js';
import { getConfig } from './get-config.js';

export async function getAllPackageJSONPath() {
  const { include = ['./**/package.json'], exclude = [] } = await getConfig();

  return fg(include.map(parsePackageJSONPath), {
    ignore: exclude.concat(['node_modules/**']),
  });
}
