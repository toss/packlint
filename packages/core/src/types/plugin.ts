import type { PackageJson } from 'type-fest';
import type { Issue } from './issue.js';
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
