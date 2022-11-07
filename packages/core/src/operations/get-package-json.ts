import { readJSON } from 'fs-extra';

import { PackageJSONType } from '../index';

export function getPackageJSON(dir: string) {
  return readJSON(`${dir}/package.json`) as Promise<PackageJSONType>;
}
