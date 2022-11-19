import { DEFAULT_ORDER, PackageJSONSchema, PackageJSONType } from '@packlint/core';
import { PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';

import { parseOrderToKeys, sortPackageJSON } from './sort-package-json';

const shuffle = <T>(x: T[]) => x.sort(() => Math.random() - 0.5);
const shuffleObjectByKeys = <T extends Record<string, unknown>>(x: T): T =>
  shuffle(Object.keys(x)).reduce((acc, key) => ({ ...acc, [key]: x[key] }), {} as T);

const ShuffledPackageJSONArbitrary = PackageJSONArbitrary.map(shuffleObjectByKeys);

const OrderArbitrary = fc
  .shuffledSubarray([...DEFAULT_ORDER, '...' as const], { minLength: 1 })
  .filter(x => x[x.length - 1] !== '...');
const NonSpreadOrderArbitrary = OrderArbitrary.filter(x => !x.some(y => y === '...'));
const SpreadOrderArbitrary = OrderArbitrary.filter(x => x.some(y => y === '...'));

describe('sortPackageJSON', () => {
  it('sorts package.json properties by given order in config', () => {
    fc.assert(
      fc.property(ShuffledPackageJSONArbitrary, OrderArbitrary, (json, order) => {
        const sorted = sortPackageJSON(json, { order });

        expect(PackageJSONSchema.safeParse(sorted).success).toBe(true);

        const keys = parseOrderToKeys({ order });

        let cursor = 0;
        for (const key of Object.keys(sorted) as Array<keyof PackageJSONType>) {
          const prev = cursor;
          cursor = keys.indexOf(key);

          expect(cursor).toBeGreaterThanOrEqual(prev);
        }
      })
    );
  });
  it('parse config order not including ... syntax to keys ', () => {
    fc.assert(
      fc.property(NonSpreadOrderArbitrary, _order => {
        const order = parseOrderToKeys({ order: _order });

        expect(order.length).toBe(DEFAULT_ORDER.length);

        _order.forEach((_, i) => expect(order[i]).toBe(_order[i]));
      })
    );
  });
  it('parse order including ... syntax to keys', () => {
    fc.assert(
      fc.property(SpreadOrderArbitrary, _order => {
        const order = parseOrderToKeys({ order: _order });

        expect(order.length).toBe(DEFAULT_ORDER.length);
      })
    );
  });
});
