import { AllCommand, MergeCommand, SortCommand } from '@packlint/command';
import { ConfigType, getConfig } from '@packlint/core';
import { BaseContext, Cli } from 'clipanion';

export async function main() {
  async function run() {
    const cli = new Cli<BaseContext & { config: ConfigType }>({
      binaryName: 'packlint',
      binaryLabel: 'Package.json Manager',
      binaryVersion: '0.0.1',
    });

    try {
      await exec(cli);
    } catch (error) {
      process.stdout.write(cli.error(error));
      process.exitCode = 1;
    }
  }

  async function exec(cli: Cli<BaseContext & { config: ConfigType }>) {
    const config = await getConfig();

    cli.register(SortCommand);
    cli.register(MergeCommand);
    cli.register(AllCommand);

    const command = cli.process(process.argv.slice(2), { config });

    return cli.runExit(command, { config });
  }

  return run().catch(error => {
    process.stdout.write(error.stack || error.message);
    process.exitCode = 1;
  });
}
