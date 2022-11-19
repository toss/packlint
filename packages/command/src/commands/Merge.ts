import { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext } from 'clipanion';

import { mergePackageJSON } from '../operations';
import { PacklintCommand } from './Base';

export class MergeCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [['merge']];

  write = true;

  async action(json: PackageJSONType) {
    return mergePackageJSON(json, this.context.config);
  }
}
