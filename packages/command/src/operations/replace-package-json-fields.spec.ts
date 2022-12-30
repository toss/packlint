import { PackageJSONSchema } from '@packlint/core';
import { ConfigArbitrary, PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';
import { describe, test } from 'vitest';

import { replacePackageJSONFields } from './replace-package-json-fields.js';

describe('replacePackageJSONFields', () => {
  test('The result should be the form of package.json', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, ConfigArbitrary, (target, config) => {
        const { success } = PackageJSONSchema.safeParse(replacePackageJSONFields(target, config));

        return success;
      })
    );
  });
});
