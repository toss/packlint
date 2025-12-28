import type { Plugin } from '../types/index.js';

/**
 * Creates a Packlint plugin.
 *
 * @param plugin - The plugin configuration.
 * @returns The same plugin object.
 *
 * @remarks
 * When implementing the `rule.fix` method, it is highly recommended to follow the **immutability principle**
 * for optimal performance:
 *
 * 1. No changes: If the rule does not need to modify the `package.json`, return the original `pkg` object.
 * 2. Changes: If the rule modifies the `package.json`, return a **new object** (e.g., using spread syntax).
 *
 * This allows the core engine to detect changes using a simple reference check (`nextPkg !== prevPkg`),
 * which is `O(1)` and significantly faster than deep equality or stringification.
 *
 * @example
 * ```ts
 * fix: async ({ checkResult }) => {
 *   if (checkResult.length === 0) return pkg; // Return original if no fix needed
 *   return { ...pkg, private: true }; // Return new object if fixed
 * }
 * ```
 */
export function createPlugin<T extends any[]>(plugin: (...args: T) => Plugin) {
  return plugin;
}
