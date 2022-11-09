import { PackageJSONFromPathSchema } from '../models';

export async function getPackageJSON(_path: string) {
  return PackageJSONFromPathSchema.parseAsync(_path);
}
