import { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext } from 'clipanion';

import { replaceFields } from '../operations';
import { PacklintCommand } from './Base';

export class ReplaceCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [['replace']];

  write = true;

  async action(json: PackageJSONType) {
    return replaceFields(json, this.context.config);
  }
}
