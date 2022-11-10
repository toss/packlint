import { z } from 'zod';

import { REGEX } from '../utils/regex';

/** file entry path must start with './'  */
export const ExportsEntryPathSchema = z.string().regex(REGEX.packageExportsEntryPath);

/** @see https://nodejs.org/api/packages.html#package-entry-points */
// 또 다른 게 생길 수도 있어서..
export const ExportsEntryConditionSchema = z.enum([
  'require',
  'import',
  'default',
  'types',
  'node-addons',
  'node',
  // 오타
  'browswer',
  'react-native',
  'deno',
  'development',
  'production',
]);
export const ExportsEntryKeySchema = z.union([ExportsEntryPathSchema, ExportsEntryConditionSchema]);

export const ExportsEntryObjectSchema = z.record(
  ExportsEntryKeySchema,
  z.union([
    ExportsEntryPathSchema,
    z.record(
      ExportsEntryKeySchema,
      z.union([ExportsEntryPathSchema, z.record(ExportsEntryKeySchema, ExportsEntryPathSchema)])
    ),
  ])
);

export const ExportsSchema = z.union([ExportsEntryPathSchema, ExportsEntryObjectSchema]);
