import {
  ConfigType,
  getAllPackageJSONPath,
  getPackageJSON,
  PackageJSONSchema,
  PackageJSONType,
  writePackageJSON,
} from '@packlint/core';
import { BaseContext, Command } from 'clipanion';

export abstract class PacklintCommand<T extends BaseContext & { config: ConfigType }> extends Command<T> {
  abstract write: boolean;
  abstract action(json: PackageJSONType): Promise<PackageJSONType>;

  async runAll() {
    const jsons = await Promise.all(
      (
        await getAllPackageJSONPath()
      ).map(async path => ({
        json: await getPackageJSON(path),
        path,
      }))
    );

    return jsons.map(async ({ json, path }) => {
      const res = await this.action(json);

      if (this.write) {
        await writePackageJSON(res, path);
      }

      return res;
    });
  }

  async execute() {
    try {
      await this.runAll();
    } catch (e) {
      console.error(e);
    }
  }
}
