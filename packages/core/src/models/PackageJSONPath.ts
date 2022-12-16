export type PackageJSONPath = string & { __endsWith: 'packageJSON' };

export function parsePackageJSONPath(s: string) {
  if (!s.endsWith('package.json')) {
    throw new Error(`${s} must be end with package.json.`);
  }

  return s as PackageJSONPath;
}
