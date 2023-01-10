import {
  ConfigType,
  getAllPackageJSONPathByConfig,
  getConfig,
  getPackageJSON,
  PackageJSONType,
  PacklintError,
  parsePackageJSONPath,
  writePackageJSON,
} from '@packlint/core';
import { BaseContext, Command, Option } from 'clipanion';
import nodePath from 'path';

export abstract class PacklintCommand<T extends BaseContext & { config: ConfigType }> extends Command<T> {
  recursive = Option.Boolean('--recursive,-R', false);

  abstract write: boolean;

  abstract action(json: PackageJSONType, config: ConfigType): Promise<PackageJSONType>;

  async run(_path = `${process.cwd()}/package.json`): Promise<PackageJSONType> {
    try {
      const path = parsePackageJSONPath(_path);
      const json = await getPackageJSON(path);

      if (json.packlint === false) {
        return json;
      }

      const config = await getConfig({ cwd: nodePath.resolve(path) });

      const res = await this.action.call(this, json, config);

      if (this.write) {
        await writePackageJSON(res, path);
      }

      return res;
    } catch (e) {
      throw PacklintError.of(e, _path);
    }
  }

  async runAll() {
    const paths = await getAllPackageJSONPathByConfig();
    const jsons = await Promise.all(paths.map(path => this.run.call(this, path)));

    return jsons;
  }

  async execute() {
    try {
      if (this.recursive) {
        await this.runAll();
        return;
      }
      await this.run();
    } catch (e) {
      if (e instanceof PacklintError) {
        console.log(e.display);
      } else {
        console.error(e);
      }
    }
  }
}
