import { DEFAULT_ORDER, PackageJSONType } from '@packlint/core';
import { PackageJSONArbitrary } from '@packlint/core/testing';
import * as fc from 'fast-check';
import { shuffledSubarray } from 'fast-check';

import { parsePackageJSONOrder, sortPackageJSON } from './sort-package-json';

const shuffle = <T>(x: T[]) => x.sort(() => Math.random() - 0.5);
const shuffleObjectByKeys = <T extends Record<string, unknown>>(x: T): T =>
  shuffle(Object.keys(x)).reduce((acc, key) => ({ ...acc, [key]: x[key] }), {} as T);

const ShuffledPackageJSONArbitrary = PackageJSONArbitrary.map(shuffleObjectByKeys);

const OrderArbitrary = shuffledSubarray([...DEFAULT_ORDER, '...' as const], { minLength: 1 });

const NonSpreadOrderArbitrary = OrderArbitrary.filter(x => !x.some(y => y === '...'));

const SpreadOrderArbitrary = OrderArbitrary.filter(x => x.some(y => y === '...')).filter(
  x => x[x.length - 1] !== '...'
);

describe('sortPackageJSON', () => {
  it('sorts package.json properties by order', () => {
    fc.assert(
      fc.property(ShuffledPackageJSONArbitrary, NonSpreadOrderArbitrary, (json, _order) => {
        const sorted = sortPackageJSON(json, { order: _order });

        const order = [...new Set([..._order, ...DEFAULT_ORDER])];

        let cursor = 0;
        for (const key of Object.keys(sorted) as Array<keyof PackageJSONType>) {
          const prev = cursor;
          cursor = order.indexOf(key);

          expect(cursor).toBeGreaterThanOrEqual(prev);
        }
      })
    );
  });
  it('parse order not including ... syntax', () => {
    fc.assert(
      fc.property(NonSpreadOrderArbitrary, _order => {
        const order = parsePackageJSONOrder({ order: _order });

        expect(order.length).toBe(DEFAULT_ORDER.length);

        _order.forEach((_, i) => expect(order[i]).toBe(_order[i]));
      })
    );
  });
  it('parse order including ... syntax', () => {
    fc.assert(
      fc.property(SpreadOrderArbitrary, _order => {
        const order = parsePackageJSONOrder({ order: _order });

        expect(order.length).toBe(DEFAULT_ORDER.length);
      })
    );
  });
});
