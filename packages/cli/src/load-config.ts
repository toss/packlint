import path from 'node:path';

import type { PacklintConfig } from '@packlint/core';
import { cosmiconfig, defaultLoaders } from 'cosmiconfig';

const SUPPORTED_CONFIG_PATTERN = [
  'packlint.config.js',
  'packlint.config.ts',
  'packlint.config.mjs',
  'packlint.config.cjs',
  'packlint.config.mts',
  'packlint.config.cts',
];

const SUPPORTED_CONFIG_EXTENSIONS = ['.js', '.ts', '.mjs', '.cjs', '.mts', '.cts'];

/**
 * Loads the configuration file.
 *
 * @param pathOrDir - The path to the configuration file or the directory to search for it.
 * @returns The configuration file or null if not found.
 */
export async function loadConfig(pathOrDir: string = process.cwd()): Promise<{
  config: PacklintConfig;
  filepath: string;
} | null> {
  const explorer = cosmiconfig('packlint', {
    searchPlaces: SUPPORTED_CONFIG_PATTERN,
    loaders: {
      '.js': defaultLoaders['.js'],
      '.ts': defaultLoaders['.ts'],
      '.mjs': defaultLoaders['.mjs'],
      '.cjs': defaultLoaders['.cjs'],
      '.mts': defaultLoaders['.ts'],
      '.cts': defaultLoaders['.ts'],
    },
  });

  const isSupportedConfigPath = SUPPORTED_CONFIG_PATTERN.some(pattern => pathOrDir.endsWith(pattern));
  const isSupportedConfigExtension = SUPPORTED_CONFIG_EXTENSIONS.includes(path.extname(pathOrDir));

  if (isSupportedConfigPath || isSupportedConfigExtension) {
    try {
      const result = await explorer.load(pathOrDir);
      if (result == null) {
        throw new Error(`Failed to load config file at ${pathOrDir}`);
      }
      return { config: result.config, filepath: pathOrDir };
    } catch (error) {
      const reason = error instanceof Error ? `: ${error.message}` : '';
      throw new Error(`Failed to load config file at ${pathOrDir}${reason}`);
    }
  }

  const result = await explorer.search(pathOrDir);

  if (result == null) return null;

  return { config: result.config, filepath: result.filepath };
}
