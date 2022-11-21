import { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext } from 'clipanion';

import { replacePackageJSONFields } from '../operations';
import { PacklintCommand } from './Base';

export class ReplaceCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [['replace']];

  write = true;

  async action(json: PackageJSONType) {
    return replacePackageJSONFields(json, this.context.config);
  }
}
