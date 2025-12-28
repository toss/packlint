import { findPackageJsonFiles, LintTarget, loadConfigFile, packlint, resolveConfigFile } from '@packlint/core';
import { Command } from 'commander';
import { createConsola, LogLevels } from 'consola';
import fs from 'node:fs';
import path from 'node:path';
import * as pc from 'picocolors';
import type { PackageJson } from 'type-fest';
import { writePackage } from 'write-pkg';
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
  const resolvedConfig = resolveConfigFile(configFile);

  const filepaths = await findPackageJsonFiles(resolvedConfig.files, options.cwd);
  const targets: LintTarget[] = filepaths.map(file => {
    const absPath = path.resolve(options.cwd, file);
    return {
      filepath: absPath,
      content: JSON.parse(fs.readFileSync(absPath, 'utf-8')) as PackageJson,
    };
  });

  consola.debug('Using config:', configFile?.filepath ? path.relative(options.cwd, configFile.filepath) : 'default');
  consola.debug('Found packages:', targets.length);

  const result = await packlint(targets, resolvedConfig);

  if (options.fix) {
    let totalFixedFileCount = 0;
    for (const file of result.files) {
      if (file.isDirty) {
        await writePackage(file.filepath, file.fixedContent);
        result.files = result.files.filter(f => f.filepath !== file.filepath);
        result.issueCount -= file.issues.length;
        totalFixedFileCount++;
      }
    }

    if (totalFixedFileCount > 0) {
      consola.log(`${pc.green('ℹ')} ${totalFixedFileCount} ${pluralize('issue', totalFixedFileCount)} fixed.`);
    }
  }

  for (const file of result.files) {
    file.issues.forEach(issue => {
      consola.log(`${pc.red('✖')} ${issue.message} ${pc.dim(`(${issue.filepath})`)}`);
    });
  }

  if (result.issueCount > 0) {
    consola.error(pc.red(`${result.issueCount} ${pluralize('issue', result.issueCount)} found.`));
    process.exit(1);
  } else {
    consola.success(pc.green('No issues found.'));
    process.exit(0);
  }
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
