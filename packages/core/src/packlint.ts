import type { PackageJson } from 'type-fest';

import type { Issue, Plugin } from './types/plugin.js';

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

export interface IssueReport extends Issue {
  fixable: boolean;
  fixed: boolean;
}

export async function packlint(targets: Target[], options: Options): Promise<Diagnostic[]> {
  const reports = await Promise.all(targets.map(target => lintSingle(target, options.plugins)));

  return reports;
}

async function lintSingle(target: Target, plugins: Plugin[]): Promise<Diagnostic> {
  let currentContent = structuredClone(target.content);
  const reports: Array<IssueReport> = [];

  for (const plugin of plugins) {
    const issues = await plugin.check({
      packageJson: currentContent,
      filepath: target.filepath,
    });

    for (const issue of issues) {
      const before = JSON.stringify(currentContent);
      const result = await issue.fix?.(currentContent);
      if (result != null) {
        currentContent = result;
      }
      const after = JSON.stringify(currentContent);
      const fixed = issue.fix != null && before !== after;

      reports.push({ ...issue, fixable: issue.fix != null, fixed });
    }
  }

  return {
    filepath: target.filepath,
    input: target.content,
    output: currentContent,
    issues: reports,
  };
}
