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
}

export async function packlint(targets: Target[], options: Options): Promise<Diagnostic[]> {
  const reports = await Promise.all(targets.map(target => lintSingle(target, options.plugins)));

  return reports;
}

async function lintSingle(target: Target, plugins: Plugin[]): Promise<Diagnostic> {
  const checkParam = { packageJson: target.content, filepath: target.filepath };
  const issues = (await Promise.all(plugins.map(plugin => plugin.check(checkParam)))).flat();

  let currentContent = structuredClone(target.content);
  const reports: Array<IssueReport> = [];

  for (const issue of issues) {
    const result = await issue.fix?.(currentContent);
    if (result != null) {
      currentContent = result;
    }

    reports.push({ ...issue, fixable: issue.fix != null });
  }

  return {
    filepath: target.filepath,
    input: target.content,
    output: currentContent,
    issues: reports,
  };
}
