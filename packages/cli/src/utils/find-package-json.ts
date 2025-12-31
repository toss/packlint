import { glob } from 'node:fs/promises';
import path from 'node:path';

/**
 * Find matching files
 *
 * @param patterns glob patterns of package.json files
 * @param cwd current working directory, which defaults to `process.cwd()`
 * @returns paths of found files
 */
export async function findPackageJson(patterns: string[], cwd = process.cwd()): Promise<string[]> {
  const files: string[] = [];

  for await (const file of glob(patterns, { cwd })) {
    if (file.endsWith('package.json')) {
      files.push(path.resolve(cwd, file));
    }
  }

  return files;
}
