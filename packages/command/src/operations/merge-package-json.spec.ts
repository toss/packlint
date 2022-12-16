import { PackageJSONSchema } from '@packlint/core';
import { PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';

import { mergePackageJSON } from './merge-package-json.js';

const MergeConfigArbitrary = fc.record({
  merge: PackageJSONArbitrary,
});

describe('mergePackageJSON', () => {
  test('The result should be the form of package.json', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, MergeConfigArbitrary, (target, config) => {
        const { success } = PackageJSONSchema.safeParse(mergePackageJSON(target, config));

        return success;
      })
    );
  });
});
