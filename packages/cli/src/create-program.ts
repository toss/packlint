import { findPackageJsonFiles, LintTarget, loadConfigFile, packlint, resolveConfigFile } from '@packlint/core';
import { Command } from 'commander';
import { createConsola, LogLevels } from 'consola';
import fs from 'node:fs';
import path from 'node:path';
import * as pc from 'picocolors';
import type { PackageJson } from 'type-fest';
import { writePackage } from 'write-pkg';
import pkg from '../package.json' with { type: 'json' };

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

  const reports = await packlint(targets, resolvedConfig.plugins);

  for (const file of reports) {
    const isChanged = JSON.stringify(file.input) !== JSON.stringify(file.output);

    if (options.fix && isChanged) {
      await writePackage(file.filepath, file.output);
    }

    const relPath = path.relative(options.cwd, file.filepath);
    file.issues.forEach(issue => {
      if (issue.fixable) {
        if (options.fix) {
          consola.log(
            `${pc.green('✔')} ${issue.message} ${pc.gray(`(${relPath})`)} ${pc.bgGreen(pc.black(' FIXED '))}`
          );
        } else {
          consola.log(
            `${pc.yellow('⚠')} ${issue.message} ${pc.gray(`(${relPath})`)} ${pc.bgYellow(pc.black(' FIXABLE '))}`
          );
        }
      } else {
        consola.log(`${pc.red('✖')} ${issue.message} ${pc.gray(`(${relPath})`)}`);
      }
    });
  }

  const hasRemainingIssues = reports.some(
    f => f.issues.some(i => !i.fixable) || (!options.fix && f.issues.some(i => i.fixable))
  );

  if (hasRemainingIssues) {
    consola.error(pc.red('Some issues remain.'));
    process.exit(1);
  }

  consola.success(pc.green('No issues found.'));
  process.exit(0);
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
