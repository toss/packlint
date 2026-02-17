import type { PackageJson } from 'type-fest';
import type { Issue, IssueReport } from './types/issue.js';
import type { Plugin } from './types/plugin.js';

export interface Diagnostic {
  filepath: string;
  input: PackageJson;
  output: PackageJson;
  issues: IssueReport[];
}

export interface Target {
  filepath: string;
  content: PackageJson;
}

export interface Options {
  plugins: Plugin[];
}

export async function packlint(targets: Target[], options: Options): Promise<Diagnostic[]> {
  const reports = await Promise.all(targets.map(target => lintSingle(target, options.plugins)));

  return reports;
}

async function lintSingle(target: Target, plugins: Plugin[]): Promise<Diagnostic> {
  let current = structuredClone(target.content);
  const issues: IssueReport[] = [];

  for (const plugin of plugins) {
    for (const issue of await plugin.check({ packageJson: current, filepath: target.filepath })) {
      const { fixed, result } = await tryFix(issue, current);
      if (fixed) current = result;

      issues.push({ ...issue, fixable: issue.fix != null, fixed });
    }
  }

  return { filepath: target.filepath, input: target.content, output: current, issues };
}

async function tryFix(issue: Issue, current: PackageJson): Promise<{ fixed: boolean; result: PackageJson }> {
  if (issue.fix == null) return { fixed: false, result: current };

  const result = await issue.fix(current);
  return result != null ? { fixed: true, result } : { fixed: false, result: current };
}
