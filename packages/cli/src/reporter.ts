import type { Diagnostic } from '@packlint/core';
import path from 'node:path';
import pc from 'picocolors';
import type { CliOptions, ExitCode } from './create-program.js';

export function report(diagnostics: Diagnostic[], options: CliOptions): ExitCode {
  const counts = { fixed: 0, fixable: 0, unfixable: 0 };

  for (const { filepath, issues } of diagnostics) {
    const relPath = path.relative(options.cwd, filepath);

    for (const issue of issues) {
      if (issue.fixable && options.fix && issue.fixed) {
        counts.fixed++;
        continue;
      }

      if (issue.fixable) {
        counts.fixable++;
        console.log(`${pc.yellow('⚠')} ${issue.message} ${pc.dim(`(${relPath})`)}`);
      } else {
        counts.unfixable++;
        console.log(`${pc.red('✖')} ${issue.message} ${pc.dim(`(${relPath})`)}`);
      }
    }
  }

  return summarize(counts);
}

function summarize(counts: Record<'fixed' | 'fixable' | 'unfixable', number>): ExitCode {
  if (counts.unfixable > 0) {
    console.error('\n', pc.red(`✖ ${counts.unfixable} unfixable errors.`));
    return 1;
  }

  if (counts.fixable > 0) {
    console.error('\n', pc.yellow(`⚠ ${counts.fixable} issues fixable. Run with --fix to apply.`));
    return 1;
  }

  if (counts.fixed > 0) {
    console.log(pc.green(`✔ ${counts.fixed} issues fixed.`));
    return 0;
  }

  console.log(pc.green('✔ No issues found.'));
  return 0;
}
