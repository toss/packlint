import type { PackageJson } from 'type-fest';
import type { PacklintConfig, Rule, RuleContext } from './types/index.js';

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
  const allRules = config.plugins?.flatMap(p => p.rules) ?? [];
  if (allRules.length === 0) return { totalFileCount: targets.length, issueCount: 0, files: [] };

  const allResults = await Promise.all(targets.map(target => processFile(target, allRules)));

  const dirtyFiles = allResults.filter(f => f.issues.length > 0 || f.isDirty);

  return {
    totalFileCount: targets.length,
    issueCount: allResults.reduce((sum, f) => sum + f.issues.length, 0),
    files: dirtyFiles,
  };
}

async function processFile(target: LintTarget, rules: Rule[]): Promise<FileResult> {
  const { filepath, content } = target;
  const allIssues: Issue[] = [];

  let currentPackage = content;

  for (const rule of rules) {
    const context: RuleContext = { data: currentPackage, filepath, ruleName: rule.name };
    const issues = await rule.check(context);

    if (issues.length > 0) {
      allIssues.push(...issues);

      if (rule.fix) {
        currentPackage = await rule.fix(context);
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
