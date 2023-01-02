import type { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext, Command } from 'clipanion';

import { mergePackageJSON, sortPackageJSON } from '../operations/index.js';
import { PacklintCommand } from './index.js';

export class AllCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [Command.Default];

  write = true;

  async action(json: PackageJSONType, config: ConfigType) {
    const merged = mergePackageJSON(json, config);
    const sorted = sortPackageJSON(merged, config);

    return sorted;
  }
}
