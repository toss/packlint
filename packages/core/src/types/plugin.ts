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

export interface Plugin {
  name: string;
  rules: Rule[];
}
