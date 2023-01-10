import chalk from 'chalk';

import { isZodError, parseZodError } from './PackageJSONError.js';

export class PacklintError extends Error {
  display: string;
  name: string;

  constructor(message: string, name: string) {
    super(message);
    this.name = name;
    this.display = this.formatMessage();
  }

  formatMessage() {
    return `${chalk.red('➤')} ${chalk.underline.bold(this.name)}\n  ${chalk.red(this.message)}`;
  }

  static of(e: unknown, name: string) {
    if (isZodError(e)) {
      return new PacklintError(parseZodError(e), name);
    }

    if (e instanceof Error) {
      return new PacklintError(e.message, name);
    }

    return new PacklintError(JSON.stringify(e), name);
  }
}
