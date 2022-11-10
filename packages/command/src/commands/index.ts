import {
  ConfigType,
  getAllPackageJSONPath,
  getPackageJSON,
  // unused
  PackageJSONSchema,
  PackageJSONType,
  writePackageJSON,
} from '@packlint/core';
import { BaseContext, Command } from 'clipanion';

// packlint lint
// packlint lint --all
// 하나만..

export abstract class PacklintCommand<T extends BaseContext & { config: ConfigType }> extends Command<T> {
  abstract write: boolean;
  abstract action(json: PackageJSONType): Promise<PackageJSONType>;

  all = Option.Boolean('--all', false);

  async runAll() {
    // 요렇게 한 번 나눠주면 조금 더 잘 읽히지 않을까요?
    const paths = await getAllPackageJSONPath();

    const jsons = await Promise.all(
      paths.map(async path => ({
        json: await getPackageJSON(path),
        path,
      }))
    );

    // 그런데 이렇게 하면 Promise의 array에 대한 Promise가 반환되어서, Promise.all()로 한번 감싸주어야 할 것 같아요
    return jsons.map(async ({ json, path }) => {
      const res = await this.action(json);

      if (this.write) {
        await writePackageJSON(res, path);
      }

      return res;
    });

    // 아래처럼 그냥 Promise.all을 한 번만 쓰는 것도 좋을 듯 하네요
    // const paths = await getAllPackageJSONPath();

    // return await Promise.all(
    //   paths.map(async path => {
    //     const json = await getPackageJSON(path);
    //     const res = await this.action(json);

    //     if (this.write) {
    //       await writePackageJSON(res, path);
    //     }

    //     return res;
    //   })
    // )
  }

  async execute() {
    try {
      await this.runAll();
    } catch (e) {
      console.error(e);
    }
  }
}
