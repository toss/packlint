import type { Target } from '@packlint/core';
import fs from 'node:fs/promises';

/**
 * Convert a package.json file path into a Target object.
 * A file path must be absolute.
 */
export async function getTarget(filepath: string): Promise<Target> {
  let content: string;
  try {
    content = await fs.readFile(filepath, { encoding: 'utf-8' });
  } catch {
    throw new Error(`Failed to read file: ${filepath}`);
  }

  try {
    const parsedContent = JSON.parse(content);
    return {
      filepath: filepath,
      content: parsedContent,
    };
  } catch {
    throw new Error(`Invalid JSON in: ${filepath}`);
  }
}
