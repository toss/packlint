import { PackageJSONSchema } from '@packlint/core';
import { ConfigArbitrary, PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';
import { describe, test } from 'vitest';

import { mergePackageJSON } from './merge-package-json.js';

describe('mergePackageJSON', () => {
  test('The result should be the form of package.json', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, ConfigArbitrary, (target, config) => {
        const { success } = PackageJSONSchema.safeParse(mergePackageJSON(target, config));

        return success;
      })
    );
  });
});
