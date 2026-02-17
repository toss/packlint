import type { PackageJson } from '@packlint/core';
import detectIndent from 'detect-indent';
import { partition } from 'es-toolkit';
import fs, { glob as fsGlob } from 'node:fs/promises';
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

export async function writePackage(filepath: string, content: PackageJson): Promise<void> {
  const exsistingPackageJson = await fs.readFile(filepath, 'utf-8');
  const { indent } = detectIndent(exsistingPackageJson);

  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, JSON.stringify(content, null, indent));
}
