import { ConfigType, getAllPackageJSONPath, getPackageJSON } from '@packlint/core';
import { BaseContext, Command } from 'clipanion';

import { validateRequiredFields } from '../index';

export class ValidateCommand<T extends BaseContext & { config: ConfigType }> extends Command<T> {
  static paths = [['validate']];

  async execute() {
    try {
      const paths = await getAllPackageJSONPath();

      await Promise.all(
        paths.map(async path => {
          const json = await getPackageJSON(path);

          return validateRequiredFields(json, this.context.config);
        })
      );
    } catch (e) {
      console.error(e);
    }
  }
}
