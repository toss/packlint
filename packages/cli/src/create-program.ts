import { type Diagnostic, packlint, resolveConfig } from '@packlint/core';
import { Command } from 'commander';
import { LogLevels } from 'consola';
import path from 'node:path';
import pc from 'picocolors';
import { writePackage } from 'write-pkg';
import pkg from '../package.json' with { type: 'json' };
import { loadConfig } from './load-config.js';
import { consola } from './logger.js';
import { findPackageJson, getTarget, logIssue } from './utils/index.js';

interface CliOptions {
  fix: boolean;
  cwd: string;
  verbose: boolean;
  config?: string;
}

export function createProgram() {
  const program = new Command();

  program.name(pkg.name).description('Package.json Linter for monorepos').version(`v${pkg.version}`);

  program
    .argument('[path]', 'Path or glob pattern to package.json')
    .option('--fix', 'Fix linting errors', false)
    .option('--cwd <cwd>', 'Current working directory', process.cwd())
    .option('--verbose', 'Verbose output', false)
    .option('--config <config>', 'Path to config file')
    .action(run);

  return program;
}

async function run(pattern: string | undefined, options: CliOptions) {
  consola.level = options.verbose ? LogLevels.debug : LogLevels.info;

  const resolvedConfigPath = path.resolve(options.cwd, options.config ?? '.');
  const configResult = await loadConfig(resolvedConfigPath);

  const config = resolveConfig(configResult?.config);

  const filePatterns = pattern != null ? [pattern] : config.files;
  const files = await findPackageJson(filePatterns, options.cwd);
  const targets = await Promise.all(files.map(getTarget));

  consola.debug(
    'Using config:',
    pc.gray(configResult?.filepath ? path.resolve(options.cwd, configResult.filepath) : 'default')
  );
  consola.debug('Found packages:', pc.gray(targets.length));

  const diagnostics = await packlint(targets, { plugins: config.plugins });

  if (options.fix) {
    await applyFixes(diagnostics);
  }

  printIssues(diagnostics, options);

  const exitCode = summarize(diagnostics, options.fix);
  process.exit(exitCode);
}

async function applyFixes(diagnostics: Diagnostic[]): Promise<void> {
  for (const { filepath, input, output } of diagnostics) {
    if (JSON.stringify(input) !== JSON.stringify(output)) {
      await writePackage(filepath, output, { normalize: false });
    }
  }
}

function printIssues(diagnostics: Diagnostic[], options: Pick<CliOptions, 'cwd' | 'fix'>): void {
  for (const { filepath, issues } of diagnostics) {
    const relPath = path.relative(options.cwd, filepath);
    for (const issue of issues) {
      logIssue({
        status: issue.fixable ? (options.fix ? 'fixed' : 'fixable') : 'error',
        message: issue.message,
        filepath: relPath,
      });
    }
  }
}

function summarize(diagnostics: Diagnostic[], fix: boolean): number {
  const errorCount = countErrors(diagnostics, fix);
  const fixedCount = countFixed(diagnostics, fix);
  if (errorCount > 0) {
    consola.error(pc.red(`${errorCount} issues remain.`));
    return 1;
  }
  consola.success(pc.green(fixedCount > 0 ? `${fixedCount} issues fixed.` : 'No issues found.'));
  return 0;
}

function countErrors(diagnostics: Diagnostic[], fix: boolean): number {
  return diagnostics.reduce((count, { issues }) => {
    return count + issues.filter(({ fixable }) => !fixable || (!fix && fixable)).length;
  }, 0);
}

function countFixed(diagnostics: Diagnostic[], fix: boolean): number {
  if (!fix) return 0;
  return diagnostics.reduce((count, { issues }) => {
    return count + issues.filter(({ fixable }) => fixable).length;
  }, 0);
}
