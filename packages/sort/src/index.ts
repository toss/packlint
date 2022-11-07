import { getPackageJSON, writePackageJSON } from '@packlint/core';

import { sortPackageJSON } from './operations/sort-package-json';

async function main() {
  const dir = process.cwd();
  const _packageJSON = await getPackageJSON(dir);

  const packageJSON = sortPackageJSON(_packageJSON);

  return writePackageJSON(packageJSON, dir);
}

main().catch(console.error);
