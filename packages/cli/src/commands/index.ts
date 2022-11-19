import {
  mergePackageJSON,
  PacklintCommand,
  replaceFields,
  sortPackageJSON,
  validateRequiredFields,
} from '@packlint/command';
import type { ConfigType, PackageJSONType } from '@packlint/core';
import { BaseContext, Command, Option } from 'clipanion';

export class AllCommand<T extends BaseContext & { config: ConfigType }> extends PacklintCommand<T> {
  static paths = [Command.Default];

  sort = Option.Boolean('--sort', true);
  replace = Option.Boolean('--replace', true);
  merge = Option.Boolean('--merge', true);
  validateRequired = Option.Boolean('--required', true);

  write = true;

  async action(json: PackageJSONType) {
    if (this.validateRequired) {
      validateRequiredFields(json);
    }

    const replaced = this.replace ? replaceFields(json, this.context.config) : json;
    const merged = this.merge ? mergePackageJSON(replaced, this.context.config) : replaced;
    const sorted = this.sort ? sortPackageJSON(merged, this.context.config) : merged;

    return sorted;
  }
}
