import type { PackageJson } from 'type-fest';
import type { PacklintConfig, Plugin, PluginContext } from './types/index.js';

export interface Issue {
  message: string;
  filepath: string;
  fixable: boolean;
}

export interface LintTarget {
  filepath: string;
  content: PackageJson;
}

interface FileResult {
  filepath: string;
  fixedContent: PackageJson;
  issues: Issue[];
  isDirty: boolean;
}

export interface PacklintResult {
  /**
   * The total number of files.
   */
  totalFileCount: number;

  /**
   * The number of errors.
   */
  issueCount: number;

  /**
   * The linting result of each file.
   */
  files: FileResult[];
}

/**
 * Lint package.json files.
 *
 * @returns The linting result.
 */
export async function packlint(targets: LintTarget[], config: PacklintConfig): Promise<PacklintResult> {
  const allResults = await Promise.all(targets.map(target => processFile(target, config.plugins ?? [])));

  const dirtyFiles = allResults.filter(f => f.issues.length > 0 || f.isDirty);

  return {
    totalFileCount: targets.length,
    issueCount: allResults.reduce((sum, f) => sum + f.issues.length, 0),
    files: dirtyFiles,
  };
}

async function processFile(target: LintTarget, plugins: Plugin[]): Promise<FileResult> {
  const { filepath, content } = target;
  const allIssues: Issue[] = [];

  let currentPackage = content;

  for (const plugin of plugins) {
    const context: PluginContext = { packageJson: currentPackage, filepath };
    const issues = await plugin.check(context);

    if (issues.length > 0) {
      allIssues.push(...issues);

      if (plugin.fix) {
        currentPackage = await plugin.fix(context);
      }
    }
  }

  /**
   * NOTE: Plugin developer must return a new object if fixed.
   * if not, the engine will not detect the change.
   */
  const fixed = content !== currentPackage;

  return {
    filepath,
    fixedContent: currentPackage,
    issues: allIssues,
    isDirty: fixed,
  };
}
