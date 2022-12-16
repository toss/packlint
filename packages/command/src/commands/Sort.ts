import { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext } from 'clipanion';

import { sortPackageJSON } from '../operations/index.js';
import { PacklintCommand } from './Base.js';

export class SortCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [['sort']];

  write = true;

  async action(_json: PackageJSONType) {
    return sortPackageJSON(_json, this.context.config);
  }
}
