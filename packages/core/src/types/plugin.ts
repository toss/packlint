import type { PackageJson } from 'type-fest';
import type { Awaitable } from './utils.js';

export interface Plugin {
  name: string;
  check: (context: PluginContext) => Awaitable<Issue[]>;
}

export interface PluginContext {
  /**
   * The path to the package.json file.
   */
  filepath: string;
  /**
   * The content of the package.json file.
   */
  packageJson: PackageJson;
}

export interface Issue {
  /**
   * The code of the issue.
   */
  code: string;
  /**
   * The message of the issue.
   */
  message: string;

  /**
   * Fixer function to fix the issue.
   */
  fix?: (packageJson: PackageJson) => Awaitable<void | PackageJson>;
}
