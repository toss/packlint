import type { PackageJson } from 'type-fest';
import type { Issue } from '../packlint.js';
import type { Awaitable } from './utils.js';

export interface Plugin {
  name: string;
  check: (ctx: PluginContext) => Awaitable<Issue[]>;
  /**
   * @remarks
   * When implementing the `fix` method, it is highly recommended to follow the **immutability principle**
   * for optimal performance:
   *
   * 1. No changes: If the plugin does not need to modify the `package.json`, return the original `packageJson` object.
   * 2. Changes: If the plugin modifies the `package.json`, return a **new object** (e.g., using spread syntax).
   *
   * This allows the core engine to detect changes using a simple reference check (`nextPkg !== prevPkg`),
   * which is `O(1)` and significantly faster than deep equality or stringification.
   *
   * @example
   * ```ts
   * fix: async ({ checkResult }) => {
   *   if (checkResult.length === 0) return packageJson; // Return original if no fix needed
   *   return { ...packageJson, private: true }; // Return new object if fixed
   * }
   * ```
   */
  fix?: (ctx: PluginContext) => Awaitable<PackageJson>;
}

export interface PluginContext {
  ruleName: string;
  filepath: string;
  packageJson: PackageJson;
}
