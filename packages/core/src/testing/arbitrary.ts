import { shuffledSubarray } from 'fast-check';
import { ZodFastCheck } from 'zod-fast-check';

import { DEFAULT_ORDER } from '../contexts';
import { PackageJSONSchema } from '../models';

const filterUndefinedKeys = <T extends Record<string, unknown>>(x: T): T =>
  Object.keys(x)
    .filter(key => x[key] !== undefined && key !== '__proto__')
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]:
          typeof x[key] === 'object' && !Array.isArray(x[key]) && x[key] != null
            ? filterUndefinedKeys(x[key] as Record<string, unknown>)
            : x[key],
      }),
      {} as T
    );

export const PackageJSONArbitrary = ZodFastCheck()
  .inputOf(PackageJSONSchema)
  .filter(x => PackageJSONSchema.safeParse(x).success)
  .map(filterUndefinedKeys);

export const OrderArbitrary = shuffledSubarray([...DEFAULT_ORDER, '...' as const], { minLength: 1 });
