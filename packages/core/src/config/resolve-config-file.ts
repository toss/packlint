import { SORT_PLUGIN_NAME, sortPlugin } from '../plugin-sort.js';
import type { PacklintConfig, PacklintConfigFile } from '../types/index.js';
import { DEFAULT_CONFIG } from './default-config.js';

/**
 * Resolves the configuration file. Returns the default configuration if the configuration file is not found.
 *
 * @param configFile - The configuration file to resolve.
 * @returns The resolved configuration.
 */
export function resolveConfigFile(configFile: PacklintConfigFile | null): Required<PacklintConfig> {
  const userConfig = configFile?.config ?? {};
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  let plugins = (userConfig.plugins ?? [...DEFAULT_CONFIG.plugins]).filter(p => p.name !== SORT_PLUGIN_NAME);

  if (mergedConfig.sort !== false) {
    const sortOrder = Array.isArray(mergedConfig.sort) ? mergedConfig.sort : undefined; // use default sort order

    plugins.push(sortPlugin(sortOrder));
  }

  return {
    ...mergedConfig,
    plugins,
  };
}
