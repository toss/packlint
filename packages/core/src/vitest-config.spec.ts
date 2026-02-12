import fs from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

describe('core vitest config', () => {
  it('does not depend on fixture-kit aliases', async () => {
    const configText = await fs.readFile('packages/core/vitest.config.ts', 'utf-8');
    expect(configText).not.toContain('fixture-kit');
  });
});
