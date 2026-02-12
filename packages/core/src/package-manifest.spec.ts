import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

interface PackageManifest {
  exports?: Record<string, unknown>;
}

describe('@packlint/core package manifest', () => {
  it('does not publish dangling plugin subpath exports', async () => {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const packageJsonPath = path.resolve(dirname, '../package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8')) as PackageManifest;

    expect(packageJson.exports).not.toHaveProperty('./plugin');
  });
});
