import { getPackageJSON, writePackageJSON } from '@packlint/core';
import { Command } from 'clipanion';

import { sortPackageJSON } from '../operations/sort-package-json';

export class SortPackageJSONCommand extends Command {
  static paths = [['sort']];

  async execute() {
    try {
      const dir = process.cwd();
      const _packageJSON = await getPackageJSON(dir);

      const packageJSON = sortPackageJSON(_packageJSON);

      return writePackageJSON(packageJSON, dir);
    } catch (e) {
      console.error(e);
    }
  }
}
