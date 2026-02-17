import { sortPlugin } from '../plugin-sort.js';
import type { PacklintConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from './default-config.js';

/**
 * Resolves the configuration file. Returns the default configuration if the configuration file is not found.
 *
 * @param configFile - The configuration file to resolve.
 * @returns The resolved configuration.
 */
export function resolveConfig(config: PacklintConfig = {}): Required<PacklintConfig> {
  const files = config.files ?? DEFAULT_CONFIG.files;
  const sort = config.sort ?? DEFAULT_CONFIG.sort;
  const plugins = [...(config.plugins ?? DEFAULT_CONFIG.plugins)];

  if (sort !== false) {
    plugins.push(sortPlugin(Array.isArray(sort) ? sort : undefined));
  }

  return { files, sort, plugins };
}
