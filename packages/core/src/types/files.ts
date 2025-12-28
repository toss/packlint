import { PacklintConfig } from './config.js';

export interface PacklintConfigFile {
  /**
   * Configuration object.
   */
  config: PacklintConfig; // TODO: add supports for PacklintConfig[]

  /**
   * Path to the configuration file.
   */
  filepath: string;
}
