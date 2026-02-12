import fs from 'node:fs/promises';

import type { Target } from '@packlint/core';

/**
 * Convert a package.json file path into a Target object.
 * A file path must be absolute.
 */
export async function getTarget(filepath: string): Promise<Target> {
  let content: string;
  try {
    content = await fs.readFile(filepath, { encoding: 'utf-8' });
  } catch (error) {
    const reason = error instanceof Error ? `: ${error.message}` : '';
    throw new Error(`Failed to read file: ${filepath}${reason}`, { cause: error });
  }

  try {
    const parsedContent = JSON.parse(content);
    return {
      filepath: filepath,
      content: parsedContent,
    };
  } catch (error) {
    const reason = error instanceof Error ? `: ${error.message}` : '';
    throw new Error(`Invalid JSON in: ${filepath}${reason}`, { cause: error });
  }
}
