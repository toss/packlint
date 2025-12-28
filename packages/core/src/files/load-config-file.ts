import { findUp } from 'find-up';
import type { PacklintConfigFile } from '../types/index.js';

const SUPPORTED_CONFIG_PATTERN = [
  'packlint.config.js',
  'packlint.config.ts',
  'packlint.config.mjs',
  'packlint.config.cjs',
  'packlint.config.mts',
  'packlint.config.cts',
];

/**
 * Loads the configuration file.
 *
 * @param cwd - The current working directory.
 * @returns The configuration file or null if not found.
 */
export async function loadConfigFile(cwd = process.cwd()): Promise<PacklintConfigFile | null> {
  const filepath = await findUp(SUPPORTED_CONFIG_PATTERN, { cwd });

  if (filepath == null) return null;

  const mod = await import(filepath);

  const config = mod.default;

  if (config == null) return null;

  return { config, filepath };
}
