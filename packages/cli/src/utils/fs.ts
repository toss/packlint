import { partition } from 'es-toolkit';
import { glob as fsGlob } from 'node:fs/promises';
import path from 'node:path';

/**
 * Find matching files
 *
 * @param patterns glob patterns of files. Exclude patterns start with `!`.
 * @param cwd current working directory, which defaults to `process.cwd()`
 *
 * @returns paths of found files
 */
export async function* glob(patterns: string[], cwd = process.cwd()): AsyncIterable<string> {
  const [exclude, include] = partition(patterns, pattern => pattern.startsWith('!'));

  const excludePattern = exclude.map(pattern => pattern.slice(1));

  for await (const file of fsGlob(include, { cwd, exclude: excludePattern })) {
    yield file;
  }
}

export function normalizePackageJsonPath(pattern: string): string {
  if (!pattern.endsWith('/package.json')) {
    return path.join(pattern, 'package.json');
  }

  return pattern;
}
