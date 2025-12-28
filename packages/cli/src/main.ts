import { loadConfigFile, type PacklintConfig } from '@packlint/core';
import { Command } from 'commander';
import { createConsola } from 'consola';

import packageJson from '../package.json' with { type: 'json' };

const console = createConsola({
  fancy: true,
  defaults: {
    tag: packageJson.name,
  },
  formatOptions: {
    date: false,
  },
});

export async function main() {
  const program = new Command();

  program.name(packageJson.name).description('Package.json Linter for monorepos').version(`v${packageJson.version}`);

  program.option('--fix', 'Fix linting errors', false).action(async function (this) {
    // get config
    const configFile = await loadConfigFile<PacklintConfig>();

    if (configFile === null) {
      console.error('No config file found');
      return;
    }

    // get target files

    if (this.getOptionValue('fix') === true) {
      console.log('fixed!');
    }
  });

  program.parse(process.argv);
}
