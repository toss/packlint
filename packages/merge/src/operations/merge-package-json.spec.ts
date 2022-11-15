import { PackageJSONSchema } from '@packlint/core';
import { PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';

import { mergePackageJSON } from './merge-package-json';

describe('mergePackageJSON', () => {
  it('Result should be a form of PackageJSON', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, PackageJSONArbitrary, (target, source) => {
        const { success } = PackageJSONSchema.safeParse(mergePackageJSON(target, { merge: source }));

        return success;
      })
    );
  });
  it('Result should contain values from the source object', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, PackageJSONArbitrary, (target, source) => {
        const merged = mergePackageJSON(target, { merge: source });

        expect(merged).toMatchObject(source);
      })
    );
  });
});
