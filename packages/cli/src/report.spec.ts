import type { Diagnostic } from '@packlint/core';
import { describe, expect, it } from 'vitest';

import { countErrors, countFixed } from './report.js';

function createDiagnostic({
  input,
  output,
  fixable,
  fixed,
}: {
  input: Diagnostic['input'];
  output: Diagnostic['output'];
  fixable: boolean;
  fixed: boolean;
}): Diagnostic {
  return {
    filepath: '/repo/package.json',
    input,
    output,
    issues: [
      {
        code: 'test-issue',
        message: 'test issue',
        fixable,
        fixed,
      },
    ],
  };
}

describe('report', () => {
  it('counts unchanged fixable issues as remaining errors in --fix mode', () => {
    const diagnostics = [
      createDiagnostic({
        input: { name: 'packlint' },
        output: { name: 'packlint' },
        fixable: true,
        fixed: false,
      }),
    ];

    expect(countErrors(diagnostics, true)).toBe(1);
    expect(countFixed(diagnostics, true)).toBe(0);
  });

  it('counts changed fixable issues as fixed in --fix mode', () => {
    const diagnostics = [
      createDiagnostic({
        input: { name: 'packlint' },
        output: { name: 'packlint', version: '1.0.0' },
        fixable: true,
        fixed: true,
      }),
    ];

    expect(countErrors(diagnostics, true)).toBe(0);
    expect(countFixed(diagnostics, true)).toBe(1);
  });
});
