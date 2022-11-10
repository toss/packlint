import { PacklintCommand } from '@packlint/command';
import { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext } from 'clipanion';

import { replaceFields } from '../index';

export class ReplaceCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [['replace']];

  write = true;

  async action(json: PackageJSONType) {
    return replaceFields(json, this.context.config);
  }
}
