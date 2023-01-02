import type { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext, Command, Option } from 'clipanion';

import { mergePackageJSON, sortPackageJSON } from '../operations/index.js';
import { PacklintCommand } from './index.js';

export class AllCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [Command.Default];

  sort = Option.Boolean('--sort', true);
  merge = Option.Boolean('--merge', true);

  write = true;

  async action(json: PackageJSONType, config: ConfigType) {
    const merged = this.merge ? mergePackageJSON(json, config) : json;
    const sorted = this.sort ? sortPackageJSON(merged, config) : merged;

    return sorted;
  }
}
