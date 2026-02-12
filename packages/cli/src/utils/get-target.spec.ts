import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { getTarget } from './get-target.js';

async function createTempDir(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

describe('getTarget', () => {
  it('includes the original read error detail', async () => {
    const filepath = '/tmp/packlint-file-that-does-not-exist.json';

    await expect(getTarget(filepath)).rejects.toThrow(/ENOENT/);
  });

  it('includes the original parse error detail', async () => {
    const tempDir = await createTempDir('packlint-get-target-');
    const filepath = path.join(tempDir, 'package.json');
    await fs.writeFile(filepath, '{"name": "packlint",', 'utf-8');

    await expect(getTarget(filepath)).rejects.toThrow(/Expected|Unexpected/);
  });
});
