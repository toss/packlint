import type { PackageJson } from 'type-fest';
import { describe, expect, it } from 'vitest';
import type { Diagnostic } from './packlint.js';
import { packlint } from './packlint.js';
import { sortPlugin } from './plugin-sort.js';

interface SortCase {
  title: string;
  input: PackageJson;
  expectedOutput: PackageJson;
  sortOrder?: string[];
  expectedIssues: number;
}

async function runSort(input: PackageJson, sortOrder?: string[]): Promise<Diagnostic> {
  const [diagnostic] = await packlint(
    [
      {
        filepath: 'package.json',
        content: input,
      },
    ],
    { plugins: [sortPlugin(sortOrder)] }
  );

  return diagnostic;
}

const SORT_CASES: SortCase[] = [
  {
    title: 'sorts known keys by default order and unknown keys alphabetically',
    input: {
      scripts: { build: 'tsc' },
      version: '1.0.0',
      zebra: true,
      name: 'demo',
      alpha: true,
      description: 'demo package',
      dependencies: { zod: '^3.0.0' },
      license: 'MIT',
    },
    expectedOutput: {
      name: 'demo',
      version: '1.0.0',
      description: 'demo package',
      license: 'MIT',
      scripts: { build: 'tsc' },
      dependencies: { zod: '^3.0.0' },
      alpha: true,
      zebra: true,
    },
    expectedIssues: 1,
  },
  {
    title: 'keeps an already sorted package.json unchanged',
    input: {
      name: 'already-sorted',
      version: '1.0.0',
      description: 'already sorted package',
      license: 'MIT',
      scripts: { test: 'vitest' },
      dependencies: { express: '^4.0.0' },
      alpha: true,
      zebra: true,
    },
    expectedOutput: {
      name: 'already-sorted',
      version: '1.0.0',
      description: 'already sorted package',
      license: 'MIT',
      scripts: { test: 'vitest' },
      dependencies: { express: '^4.0.0' },
      alpha: true,
      zebra: true,
    },
    expectedIssues: 0,
  },
  {
    title: 'applies custom sort order, then alphabetical order for remaining keys',
    input: {
      version: '1.0.0',
      scripts: { build: 'tsc' },
      name: 'custom-order',
      dependencies: { react: '^18.0.0' },
      description: 'custom order package',
      license: 'MIT',
    },
    sortOrder: ['description', 'name', 'version'],
    expectedOutput: {
      description: 'custom order package',
      name: 'custom-order',
      version: '1.0.0',
      dependencies: { react: '^18.0.0' },
      license: 'MIT',
      scripts: { build: 'tsc' },
    },
    expectedIssues: 1,
  },
];

describe('sortPlugin', () => {
  for (const testCase of SORT_CASES) {
    it(testCase.title, async () => {
      const diagnostic = await runSort(testCase.input, testCase.sortOrder);

      expect(Object.keys(diagnostic.output)).toEqual(Object.keys(testCase.expectedOutput));
      expect(diagnostic.output).toEqual(testCase.expectedOutput);
      expect(diagnostic.issues).toHaveLength(testCase.expectedIssues);

      if (testCase.expectedIssues > 0) {
        expect(diagnostic.issues[0]).toEqual({
          message: 'package.json keys are not sorted correctly.',
          fixable: true,
          fixed: true,
        });
      }
    });
  }
});
