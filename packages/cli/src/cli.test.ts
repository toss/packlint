import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it } from 'vitest';

const fixturesDir = join(__dirname, '../../../__fixtures__');
const cli = join(__dirname, '../dist/main.mjs');

const run = (args: string, cwd: string) => {
  try {
    return execSync(`node ${cli} ${args}`, {
      cwd,
      encoding: 'utf-8',
      env: { ...process.env, NO_COLOR: '1' },
    });
  } catch (e: unknown) {
    return (e as { stdout: string }).stdout;
  }
};

describe('packlint CLI', () => {
  describe('sorted', () => {
    const cwd = join(fixturesDir, 'sorted');

    it('check', () => {
      const result = run('package.json', cwd);
      expect(result).toMatchSnapshot();
    });
  });

  describe('unsorted', () => {
    const cwd = join(fixturesDir, 'unsorted');
    const pkgPath = join(cwd, 'package.json');
    let original: string;

    afterEach(() => {
      writeFileSync(pkgPath, original);
    });

    it('check', () => {
      original = readFileSync(pkgPath, 'utf-8');
      const result = run('package.json', cwd);
      expect(result).toMatchSnapshot();
    });

    it('fix', () => {
      original = readFileSync(pkgPath, 'utf-8');
      run('package.json --fix', cwd);
      const fixed = readFileSync(pkgPath, 'utf-8');
      expect(fixed).toMatchSnapshot();
    });
  });

});
