import { readJSON } from 'fs-extra';
import { z } from 'zod';

import { PackageJSONSchema } from './PackageJSON';

// https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
// 사용자의 입력, 서버로부터의 응답을 믿지 못하기 때문에 우리는 validation을 하는데,
// validation을 이곳저곳에서 하다 보면 힘들어진다. (validation 로직은 전염되려고 하는 특성이 있음)
// 유효한 타입 정의 (e.g. NonEmptyArray) 를 별도로 정의하고, 이 타입을 만들려면 "parse"를 하도록 함.
// NonEmptyArray 같은 타입을 인자로 받는다 => 항상 Array가 비어있는지 검사할 필요가 없어짐
// validation을 가장 처음에만 하는 것
export const PackageJSONPathSchema = z
  .string()
  .default(process.cwd())
  .transform(s => {
    if (s.endsWith('package.json')) {
      return s;
    }

    if (s.endsWith('/')) {
      return `${s}package.json`;
    }

    return `${s}/package.json`;
  });

type PackageJSONPath = string & { __brand: 'packageJSON' };

function findPackageJSONPath(dir: string) {
  // dir에서 package.json을 찾아서, 있는 경우에만

  return packageJSONPath as PackageJSONPath;
}

export const PackageJSONFromPathSchema = z
  .string()
  .transform(PackageJSONPathSchema.parse)
  .transform(x => readJSON(x).then(PackageJSONSchema.parse));
