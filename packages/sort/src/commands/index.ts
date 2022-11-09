import { ConfigType, getAllPackageJSONPath, getPackageJSON, writePackageJSON } from '@packlint/core';
import { BaseContext, Command } from 'clipanion';

import { sortPackageJSON } from '../operations/sort-package-json';

export class SortCommand<T extends BaseContext & { config: ConfigType }> extends Command<T> {
  static paths = [['sort']];

  async execute() {
    try {
      const paths = await getAllPackageJSONPath();

      await Promise.all(
        paths.map(async path => {
          const json = sortPackageJSON(await getPackageJSON(path), this.context.config);

          return writePackageJSON(json, path);
        })
      );
    } catch (e) {
      console.error(e);
    }
  }
}
