import { PacklintCommand } from '@packlint/command';
import { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext } from 'clipanion';

import { validateRequiredFields } from '../index';

export class ValidateCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [['validate']];

  write = false;

  async action(json: PackageJSONType) {
    return validateRequiredFields(json, this.context.config);
  }
}
