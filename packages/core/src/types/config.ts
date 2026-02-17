import type { Plugin } from './plugin.js';

export interface PacklintConfig {
  /**
   * Glob patterns to match package.json files to lint.
   *
   * @default ["**\\/package.json", "!**\\/node_modules"]
   * @example
   * ```ts
   * {
   *   files: ["services/**\/package.json", "!**\/fixtures/**"]
   * }
   * ```
   */
  files?: string[];

  /**
   * Whether to sort package.json files.
   * If an array is provided, it will be used as the sort order.
   *
   * @default true
   */
  sort?: boolean | string[];

  /**
   * Plugins to use.
   *
   * @default []
   */
  plugins?: Plugin[];
}
