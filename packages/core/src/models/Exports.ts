import { z } from 'zod';

import { REGEX } from '../utils/regex';

/** file entry path must start with './'  */
export const ExportsEntryPathSchema = z.string().regex(REGEX.packageExportsEntryPath);

/** @see https://nodejs.org/api/packages.html#package-entry-points */
export const ExportsEntryConditionSchema = z.enum([
  'require',
  'import',
  'default',
  'types',
  'node-addons',
  'node',
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
