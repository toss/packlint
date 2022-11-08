import { ConfigType, getPackageJSON, writePackageJSON } from '@packlint/core';
import { BaseContext, Command } from 'clipanion';

import { sortPackageJSON } from '../operations/sort-package-json';

export class SortCommand<T extends BaseContext & { config: ConfigType }> extends Command<T> {
  static paths = [['sort']];

  async execute() {
    try {
      const dir = process.cwd();
      const _packageJSON = await getPackageJSON(dir);

      const packageJSON = sortPackageJSON(_packageJSON, this.context.config);

      return writePackageJSON(packageJSON, dir);
    } catch (e) {
      console.error(e);
    }
  }
}
