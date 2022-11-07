import { z } from 'zod';

import { REGEX } from '../utils/regex';

export const ExportsEntryPathSchema = z.string().regex(REGEX.packageExportsEntryPath).nullable();
export const ExportsEntryObjectSchema = z.record(
  z.union([z.enum(['require', 'import', 'node', 'default']), z.string().regex(REGEX.packageExportsEntryProperties)]),
  ExportsEntryPathSchema
);

export const ExportsSchema = z.union([
  z.record(ExportsEntryPathSchema, z.union([ExportsEntryPathSchema, ExportsEntryObjectSchema])),
  ExportsEntryObjectSchema,
]);
