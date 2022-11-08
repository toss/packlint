import { ConfigType, getPackageJSON } from '@packlint/core';
import { BaseContext, Command } from 'clipanion';

import { validateRequiredFields } from '../index';

export class ValidateCommand<T extends BaseContext & { config: ConfigType }> extends Command<T> {
  static paths = [['validate']];

  async execute() {
    try {
      const dir = process.cwd();
      const _packageJSON = await getPackageJSON(dir);

      validateRequiredFields(_packageJSON, this.context.config);
    } catch (e) {
      console.error(e);
    }
  }
}
