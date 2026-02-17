import { type PackageJson, packlint, resolveConfig, type Target } from '@packlint/core';
import { Command } from 'commander';
import fs from 'node:fs/promises';
import { writePackage } from 'write-pkg';
import pkg from '../package.json' with { type: 'json' };
import { loadConfig } from './load-config.js';
import { report } from './reporter.js';
import { glob } from './utils.js';

export interface CliOptions {
  fix: boolean;
  cwd: string;
}

export type ExitCode = 0 | 1;

export function createProgram(): Command {
  const program = new Command();

  program.name(pkg.name).description('Package.json Linter for monorepos').version(`v${pkg.version}`, '-v,--version');

  program
    .argument('[path]', 'Path or glob pattern to package.json')
    .option('--fix', 'Fix linting errors', false)
    .option('--cwd <cwd>', 'Current working directory', process.cwd())
    .action(run);

  return program;
}

async function run(pattern: string | undefined, options: CliOptions): Promise<void> {
  let exitCode: ExitCode = 0;

  try {
    const configFile = await loadConfig(options.cwd);
    const config = resolveConfig(configFile?.config);
    const filePatterns = pattern != null ? [pattern] : config.files;

    const files = await Array.fromAsync(glob(filePatterns, options.cwd));

    const targets = await Promise.all(
      files.map(async filepath => {
        const raw = await fs.readFile(filepath, 'utf-8');
        return { filepath, content: JSON.parse(raw) as PackageJson } as Target;
      })
    );
    const diagnostics = await packlint(targets, { plugins: config.plugins });

    if (options.fix) {
      await Promise.all(
        diagnostics
          .filter(({ issues }) => issues.some(i => i.fixed === true))
          .map(({ filepath, output }) => writePackage(filepath, output, { normalize: false }))
      );
    }

    exitCode = report(diagnostics, options);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    exitCode = 1;
  } finally {
    process.exit(exitCode);
  }
}
