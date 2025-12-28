export interface PacklintConfig {
  /**
   * Glob patterns to match package.json files to lint.
   *
   * @default ["package.json", "**\/package.json"]
   * @example
   * ```ts
   * {
   *   files: ["services/**\/package.json"]
   * }
   * ```
   */
  files?: string[];

  /**
   * Whether to sort package.json files.
   *
   * @default true
   */
  sort?: boolean;

  /**
   * Plugins to use.
   *
   * @default []
   */
  plugins?: any[]; // TODO: define plugin type
}

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
