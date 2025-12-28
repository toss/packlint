import { glob } from 'node:fs/promises';

/**
 * Find matching files
 *
 * @param patterns glob patterns of package.json files
 * @param cwd current working directory, which defaults to `process.cwd()`
 * @returns paths of found files
 */
export async function findPackageJsonFiles(patterns: string[], cwd = process.cwd()): Promise<string[]> {
  let files: string[] = [];

  for await (const file of glob(patterns, { cwd })) {
    if (file.endsWith('package.json')) {
      files.push(file);
    }
  }

  return files;
}
