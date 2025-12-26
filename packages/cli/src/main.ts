import { Command } from 'commander';
import packageJson from '../package.json' with { type: 'json' };

export async function main() {
  const program = new Command();

  program.name('packlint').description('Package.json Linter for monorepos').version(packageJson.version);

  program.parse(process.argv);
}
