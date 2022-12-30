import fg from 'fast-glob';

import { parsePackageJSONPath } from '../models/index.js';
import { getAllPackageJSONPath } from './get-all-package-json-path.js';
import { getConfig } from './get-config.js';

export async function getAllPackageJSONPathByConfig() {
  const { include = await getAllPackageJSONPath(), exclude = [] } = await getConfig();

  return fg(include.map(parsePackageJSONPath), {
    ignore: exclude.concat(['node_modules/**']),
  });
}

getAllPackageJSONPathByConfig.sync = function () {
  const { include = getAllPackageJSONPath.sync(), exclude = [] } = getConfig.sync();

  return fg.sync(include.map(parsePackageJSONPath), {
    ignore: exclude.concat(['node_modules/**']),
  });
};
