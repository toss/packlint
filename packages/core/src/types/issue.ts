import type { PackageJson } from 'type-fest';
import type { Awaitable } from './utils.js';

export interface Issue {
  /**
   * The message of the issue.
   */
  message: string;
  /**
   * Fixer function to fix the issue.
   */
  fix?: (packageJson: PackageJson) => Awaitable<void | PackageJson>;
}

export interface IssueReport extends Omit<Issue, 'fix'> {
  fixable: boolean;
  fixed: boolean;
}
