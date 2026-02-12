import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createProgram } from './create-program.js';

describe('createProgram', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles runtime errors without rejecting parseAsync', async () => {
    const cwd = os.tmpdir();
    const missingConfigPath = path.join(cwd, 'my-packlint-config.ts');
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    const program = createProgram();

    const result = await program.parseAsync(
      ['node', 'packlint', '--cwd', cwd, '--config', missingConfigPath],
      { from: 'node' }
    );

    expect(result).toBe(program);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
