import type { PackageJson } from 'type-fest';
import type { Issue, Plugin } from './types/plugin.js';

interface Report {
  filepath: string;
  input: PackageJson;
  output: PackageJson;
  issues: IssueReport[];
}

export interface LintTarget {
  filepath: string;
  content: PackageJson;
}

export interface IssueReport extends Issue {
  fixable: boolean;
}

export async function packlint(targets: LintTarget[], plugins: Plugin[]): Promise<Report[]> {
  const reports = await Promise.all(targets.map(target => lintFile(target, plugins)));

  return reports;
}

async function lintFile(target: LintTarget, plugins: Plugin[]): Promise<Report> {
  const allIssues = await Promise.all(
    plugins.map(plugin =>
      plugin.check({
        packageJson: target.content,
        filepath: target.filepath,
      })
    )
  );

  const flattenedIssues = allIssues.flat();
  let currentContent = structuredClone(target.content);
  const reports: Array<IssueReport> = [];

  for (const issue of flattenedIssues) {
    if (issue.fix) {
      currentContent = (await issue.fix(currentContent)) ?? currentContent;
      reports.push({ ...issue, fixable: true });
    } else {
      reports.push({ ...issue, fixable: false });
    }
  }

  return {
    filepath: target.filepath,
    input: target.content,
    output: currentContent,
    issues: reports,
  };
}
