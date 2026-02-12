import type { Diagnostic } from '@packlint/core';

export function countErrors(diagnostics: Diagnostic[], fix: boolean): number {
  return diagnostics.reduce((count, { issues }) => {
    return count + issues.filter(issue => issue.fixable === false || (!fix && issue.fixable) || (fix && !issue.fixed)).length;
  }, 0);
}

export function countFixed(diagnostics: Diagnostic[], fix: boolean): number {
  if (!fix) return 0;
  return diagnostics.reduce((count, { issues }) => {
    return count + issues.filter(issue => issue.fixed).length;
  }, 0);
}
