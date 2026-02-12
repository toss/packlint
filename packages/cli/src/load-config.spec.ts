import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadConfig } from './load-config.js';

async function createTempDir(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

describe('loadConfig', () => {
  it('throws when an explicit config path does not exist', async () => {
    const cwd = await createTempDir('packlint-load-config-');
    const missingConfigPath = path.join(cwd, 'packlint.config.ts');

    await expect(loadConfig(missingConfigPath)).rejects.toThrow(
      `Failed to load config file at ${missingConfigPath}`
    );
  });

  it('treats custom file names with config extensions as explicit config paths', async () => {
    const cwd = await createTempDir('packlint-load-config-');
    const missingConfigPath = path.join(cwd, 'my-packlint-config.ts');

    await expect(loadConfig(missingConfigPath)).rejects.toThrow(
      `Failed to load config file at ${missingConfigPath}`
    );
  });
});
