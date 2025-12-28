import { defaultConfig } from './default-config.js';
import type { PacklintConfig, PacklintConfigFile } from './types.js';

/**
 * Resolves the configuration file. Returns the default configuration if the configuration file is not found.
 *
 * @param configFile - The configuration file to resolve.
 * @returns The resolved configuration.
 */
export function resolveConfigFile(configFile: PacklintConfigFile | null): Required<PacklintConfig> {
  if (configFile === null) {
    return defaultConfig;
  }

  return {
    ...defaultConfig,
    ...configFile.config,
  };
}
