import { PackageJSONSchema } from '@packlint/core';
import { PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';
import * as R from 'ramda';
import { ZodFastCheck } from 'zod-fast-check';

import { validateRequiredFields } from './validate-required-fields';

const RequiredConfigArbitrary = fc.record({
  required: fc.uniqueArray(ZodFastCheck().inputOf(PackageJSONSchema.keyof()), {
    maxLength: PackageJSONSchema.keyof().options.length,
  }),
});

describe('mergePackageJSON', () => {
  test('If package.json include all keys from required, then return target', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, RequiredConfigArbitrary, (target, config) => {
        fc.pre(R.all(R.has(R.__, target))(config.required));

        expect(validateRequiredFields(target, config)).toMatchObject(target);
      })
    );
  });
  test('If package.json does not include keys from required, then throw', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, RequiredConfigArbitrary, (target, config) => {
        fc.pre(R.complement(R.all(R.has(R.__, target)))(config.required));

        expect(() => validateRequiredFields(target, config)).toThrow();
      })
    );
  });
});
