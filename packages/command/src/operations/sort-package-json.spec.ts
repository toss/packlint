import { ConfigArbitrary, PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';
import { describe, expect, test } from 'vitest';

import { sortPackageJSON } from './sort-package-json.js';

const shuffle = <T>(x: T[]) => x.sort(() => Math.random() - 0.5);
const shuffleObjectByKeys = <T extends Record<string, unknown>>(x: T): T =>
  shuffle(Object.keys(x)).reduce((acc, key) => ({ ...acc, [key]: x[key] }), {} as T);

const ShuffledPackageJSONArbitrary = PackageJSONArbitrary.map(shuffleObjectByKeys);

describe('sortPackageJSON', () => {
  /**
   * Sorting result of config A and config B within the same package.json are same :
   * A. a config that includes some items that does not exists in package.json
   * B. a list which has filtered out the items (the ones that does not exists in package.json) in A
   */
  test(`Sorting Result of A and B are same`, () => {
    fc.assert(
      fc.property(
        ShuffledPackageJSONArbitrary,
        ConfigArbitrary,
        fc.array(fc.string()),
        (p, config, randomStringArray) => {
          expect(sortPackageJSON(p, config)).toMatchObject(
            sortPackageJSON(p, { order: [...config.order, ...randomStringArray] })
          );
        }
      )
    );
  });

  /**
   * let all items in config are properties of package.json
   * let An to be the nth item in config, let Bn to be the nth property of the sorted package.json
   */
  test(`An === Bn`, () => {
    fc.assert(
      fc.property(ShuffledPackageJSONArbitrary, ConfigArbitrary, (p, config) => {
        fc.pre(config.order.every(item => Object.keys(p).includes(item)));

        const res = sortPackageJSON(p, config);
        config.order.forEach((item, i) => expect(item).toBe(Object.keys(res)[i]));
      })
    );
  });
});
