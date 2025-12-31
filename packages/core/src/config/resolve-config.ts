import { SORT_PLUGIN_NAME, sortPlugin } from '../plugin-sort.js';
import type { PacklintConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from './default-config.js';

/**
 * Resolves the configuration file. Returns the default configuration if the configuration file is not found.
 *
 * @param configFile - The configuration file to resolve.
 * @returns The resolved configuration.
 */
export function resolveConfig(config: PacklintConfig = {}): Required<PacklintConfig> {
  const mergedConfig: Required<PacklintConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  let plugins = (config.plugins ?? [...DEFAULT_CONFIG.plugins]).filter(({ name }) => name !== SORT_PLUGIN_NAME);

  if (mergedConfig.sort !== false) {
    const sortOrder = Array.isArray(mergedConfig.sort) ? mergedConfig.sort : undefined; // use default sort order

    plugins.push(sortPlugin(sortOrder));
  }

  return {
    ...mergedConfig,
    plugins,
  };
}
