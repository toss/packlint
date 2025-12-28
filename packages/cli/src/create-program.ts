import { findPackageJsonFiles, loadConfigFile, resolveConfigFile } from '@packlint/core';
import { Command } from 'commander';
import { createConsola, LogLevels } from 'consola';
import path from 'node:path';
import pkg from '../package.json' with { type: 'json' };
import { pluralize } from './utils.js';

const consola = createConsola({
  defaults: {
    tag: pkg.name,
  },
  formatOptions: {
    date: false,
  },
});

interface PacklintCliOptions {
  fix: boolean;
  cwd: string;
  debug: boolean;
}

async function runPacklint(options: PacklintCliOptions) {
  consola.level = options.debug ? LogLevels.debug : LogLevels.info;

  const configFile = await loadConfigFile(options.cwd);
  consola.debug(
    configFile?.filepath
      ? `Using config file at ${path.relative(options.cwd, configFile.filepath)}`
      : 'Using default config'
  );

  const resolvedConfig = resolveConfigFile(configFile);

  const files = await findPackageJsonFiles(resolvedConfig.files, options.cwd);

  consola.debug(`Found ${files.length} package.json ${pluralize('file', files.length)}`);

  const packlint = async (..._args: any[]): Promise<any> => ({
    errorCount: 4,
    errors: [
      {
        message: 'test',
        filepath: './package.json',
      },
      {
        message:
          'very very long error message. very very long error message. very very long error message. very very long error message.',
        filepath: './package.json',
      },
      {
        message:
          'very very long error message. very very long error message. very very long error message. very very long error message.',
        filepath: './package.json',
      },
      {
        message:
          'very very long error message. very very long error message. very very long error message. very very long error message.',
        filepath: './package.json',
      },
    ],
  });

  const result = await packlint({
    files,
    config: resolvedConfig,
  });

  if (result.errorCount > 0) {
    if (options.fix === true) {
      // fix
      consola.success('Fixed!');
      return;
    }

    consola.error(`Found ${result.errorCount} ${pluralize('error', result.errorCount)}`);
    console.error(result.errors.map((error: any) => `${error.filepath}: ${error.message}`).join('\n'));

    process.exit(1);
  }

  consola.success('Linting passed!');
}

export function createProgram() {
  const program = new Command();

  program.name(pkg.name).description('Package.json Linter for monorepos').version(`v${pkg.version}`);

  program
    .option('--fix', 'Fix linting errors', false)
    .option('--cwd <cwd>', 'Current working directory', process.cwd())
    .option('--debug', 'Debug output', false)
    .action(runPacklint);

  return program;
}
