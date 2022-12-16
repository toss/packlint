import { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext } from 'clipanion';

import { validateRequiredFields } from '../operations/index.js';
import { PacklintCommand } from './Base.js';

export class RequiredCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [['validate']];

  write = false;

  async action(json: PackageJSONType) {
    return validateRequiredFields(json, this.context.config);
  }
}
