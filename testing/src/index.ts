import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

interface Fixture extends AsyncDisposable {
  fixturePath: string;
  cleanup: () => Promise<void>;
}

export async function createFixture(fixturePath: string): Promise<Fixture> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'packlint-testing-'));

  await fs.cp(fixturePath, path.join(tempDir, path.basename(fixturePath)), { recursive: true });

  const cleanup = async () => {
    await fs.rm(tempDir, { recursive: true });
  };

  return {
    fixturePath: tempDir,
    cleanup,
    [Symbol.asyncDispose]: cleanup,
  };
}
