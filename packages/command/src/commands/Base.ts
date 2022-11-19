import {
  ConfigType,
  getAllPackageJSONPath,
  getPackageJSON,
  PackageJSONType,
  parsePackageJSONPath,
  writePackageJSON,
} from '@packlint/core';
import { BaseContext, Command, Option } from 'clipanion';

export abstract class PacklintCommand<T extends BaseContext & { config: ConfigType }> extends Command<T> {
  recursive = Option.Boolean('--recursive,-R', false);
  file = Option.String('--file');

  abstract write: boolean;

  abstract action(json: PackageJSONType): Promise<PackageJSONType>;

  async run(_path = `${process.cwd()}/package.json`) {
    const path = parsePackageJSONPath(this.file ?? _path);
    const json = await getPackageJSON(path);

    if (json.packlint === false) {
      return json;
    }

    const res = await this.action.call(this, json);

    if (this.write) {
      await writePackageJSON(res, path);
    }

    return res;
  }

  async runAll() {
    const paths = await getAllPackageJSONPath();
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
      console.error(e);
    }
  }
}
