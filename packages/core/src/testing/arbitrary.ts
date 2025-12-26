import { Arbitrary, shuffledSubarray } from 'fast-check';
import { SafeParseSuccess, ZodSchema } from 'zod';
import { ZodFastCheck } from 'zod-fast-check';

import { ConfigSchema, DEFAULT_ORDER } from '../contexts/index.js';
import { PackageJSONSchema } from '../models/index.js';

const filterUndefinedKeys = <T extends Record<string, unknown>>(x: T): T =>
  Object.keys(x ?? {})
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

export function createArbitraryFromZodObject<T extends Record<string, unknown>>(schema: ZodSchema<T>): Arbitrary<T> {
  return ZodFastCheck()
    .inputOf(schema)
    .filter(x => schema.safeParse(x).success)
    .map(x => (schema.safeParse(x) as SafeParseSuccess<T>).data)
    .map(filterUndefinedKeys);
}

export const PackageJSONArbitrary = createArbitraryFromZodObject(PackageJSONSchema);

export const OrderArbitrary = shuffledSubarray(DEFAULT_ORDER, { minLength: 1 });
// @ts-expect-error FIXME: error after turning strict on.
export const ConfigArbitrary = createArbitraryFromZodObject(ConfigSchema);
