import type { PacklintConfig } from '@packlint/core';
import { cosmiconfig } from 'cosmiconfig';

const CONFIG_FILENAMES = ['packlint.config.ts', 'packlint.config.js', 'packlint.config.mjs'];

export async function loadConfig(from: string): Promise<{
  config: PacklintConfig;
  filepath: string;
} | null> {
  const explorer = cosmiconfig('packlint', {
    searchPlaces: CONFIG_FILENAMES,
  });

  const result = await explorer.search(from);
  if (result == null) return null;

  return { config: result.config as PacklintConfig, filepath: result.filepath };
}
