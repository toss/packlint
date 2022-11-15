import fg from 'fast-glob';

import { parsePackageJSONPath } from '../index';
import { getConfig } from './get-config';

export async function getAllPackageJSONPath() {
  const { include = ['./packages/**'], exclude = [] } = await getConfig();

  return fg(include.map(parsePackageJSONPath), {
    ignore: exclude.concat(['node_modules/**']),
  });
}
