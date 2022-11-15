import { DEFAULT_ORDER, PackageJSONSchema, PackageJSONType } from '@packlint/core';
import * as fc from 'fast-check';
import { z } from 'zod';
import { ZodFastCheck } from 'zod-fast-check';

import { parsePackageJSONOrder, sortPackageJSON } from './sort-package-json';

const shuffle = <T>(x: T[]) => x.sort(() => Math.random() - 0.5);
const shuffleObjectByKeys = <T extends Record<string, unknown>>(x: T): T =>
  shuffle(Object.keys(x)).reduce((acc, key) => ({ ...acc, [key]: x[key] }), {} as T);
const filterUndefinedKeys = <T extends Record<string, unknown>>(x: T): T =>
  Object.keys(x)
    .filter(key => x[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: x[key] }), {} as T);

const PackageJSONArbitrary = ZodFastCheck()
  .inputOf(PackageJSONSchema)
  .map(filterUndefinedKeys)
  .map(shuffleObjectByKeys);

const OrderArbitrary = fc.uniqueArray(ZodFastCheck().inputOf(z.union([PackageJSONSchema.keyof(), z.literal('...')])), {
  minLength: 1,
  maxLength: PackageJSONSchema.keyof().options.length,
});

const NonSpreadOrderArbitrary = OrderArbitrary.filter(x => !x.some(y => y === '...'));

const SpreadOrderArbitrary = OrderArbitrary.map(x =>
  x.reduce((acc, key, i) => {
    if (key === '...' && (x[i + 1] === undefined || x[i + 1] === '...')) {
      return [...acc];
    }
    return [...acc, key];
  }, [] as Array<keyof PackageJSONType | '...'>)
).filter(x => x.some(y => y === '...'));

describe('sortPackageJSON', () => {
  it('sorts package.json properties by order', () => {
    fc.assert(
      fc.property(PackageJSONArbitrary, NonSpreadOrderArbitrary, (json, _order) => {
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
