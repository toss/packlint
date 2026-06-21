import { describe, expect, test } from 'vitest';

import { PackageJSONSchema, PackageJSONType } from './PackageJSON.js';

describe('PackageJSONSchema', () => {
  test('accepts boolean sideEffects', () => {
    expect(PackageJSONSchema.parse({ sideEffects: false })).toEqual({ sideEffects: false });
  });

  test('accepts string array sideEffects', () => {
    const packageJSON: PackageJSONType = { sideEffects: ['*.css', './src/polyfill.js'] };

    expect(PackageJSONSchema.parse(packageJSON)).toEqual(packageJSON);
  });
});
