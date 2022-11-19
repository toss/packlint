import { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext } from 'clipanion';

import { sortPackageJSON } from '../operations';
import { PacklintCommand } from './Base';

export class SortCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [['sort']];

  write = true;

  async action(_json: PackageJSONType) {
    return sortPackageJSON(_json, this.context.config);
  }
}
