import fs from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

describe('PacklintConfig docs', () => {
  it('documents the same default files value as runtime config', async () => {
    const content = await fs.readFile('packages/core/src/types/config.ts', 'utf-8');
    expect(content).not.toContain('@default ["package.json", "**/package.json"]');
    expect(content).toContain('@default ["**\\\\/package.json"]');
  });
});
