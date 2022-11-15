import { shuffledSubarray } from 'fast-check';
import { ZodFastCheck } from 'zod-fast-check';

import { DEFAULT_ORDER } from '../contexts';
import { PackageJSONSchema } from '../models';

const filterUndefinedKeys = <T extends Record<string, unknown>>(x: T): T =>
  Object.keys(x)
    .filter(key => x[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: x[key] }), {} as T);

export const PackageJSONArbitrary = ZodFastCheck().inputOf(PackageJSONSchema).map(filterUndefinedKeys);
export const OrderArbitrary = shuffledSubarray([...DEFAULT_ORDER, '...' as const], { minLength: 1 });
