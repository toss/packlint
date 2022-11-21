import { PackageJSONSchema } from '@packlint/core';
import { PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';

import { replacePackageJSONFields } from './replace-package-json-fields';

const ReplaceConfigArbitrary = fc.record({
  replace: PackageJSONArbitrary,
});

describe('replacePackageJSONFields', () => {
  test('The result should be the form of package.json', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, ReplaceConfigArbitrary, (target, config) => {
        const { success } = PackageJSONSchema.safeParse(replacePackageJSONFields(target, config));

        return success;
      })
    );
  });
});
