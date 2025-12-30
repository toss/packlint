import type { PackageJson } from 'type-fest';
import type { Issue } from '../packlint.js';
import type { Awaitable } from './utils.js';

export interface RuleContext {
  ruleName: string;
  filepath: string;
  data: PackageJson;
}

export interface Rule {
  name: string;
  check: (ctx: RuleContext) => Awaitable<Issue[]>;
  fix?: (ctx: RuleContext) => Awaitable<PackageJson>;
}

/**
 * A Packlint plugin.
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
export interface Plugin {
  name: string;
  rules: Rule[];
}
