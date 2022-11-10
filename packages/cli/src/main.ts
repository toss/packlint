import { ConfigType, getConfig } from '@packlint/core';
import { SortCommand } from '@packlint/sort';
import { ValidateCommand } from '@packlint/validate';
import { BaseContext, Cli } from 'clipanion';

// 이렇게 더 간단하게 써도 되지 않을까요?
export async function main() {
  const cli = new Cli<BaseContext & { config: ConfigType }>({
    binaryName: 'packlint',
    binaryLabel: 'Package.json Manager',
    binaryVersion: '0.0.1',
  });

  const config = await getConfig();

  cli.register(SortCommand);
  cli.register(ValidateCommand);

  try {
    const command = cli.process(process.argv.slice(2), { config });

    return await cli.runExit(command, { config });
  } catch (error: any) {
    process.stdout.write(error.stack || error.message);
    process.exitCode = 1;
  }
}
