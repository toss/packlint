import fs from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

describe('cli tsdown config', () => {
  it('does not force-bundle @packlint/core via noExternal', async () => {
    const configText = await fs.readFile('packages/cli/tsdown.config.ts', 'utf-8');
    expect(configText).not.toContain('noExternal');
  });
});
