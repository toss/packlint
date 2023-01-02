import { z } from 'zod';

import { PackageJSONSchema } from '../models/index.js';

export const DEFAULT_ORDER = PackageJSONSchema.keyof().options;

export const ConfigSchema = z
  .object({
    files: z.array(z.string()).default(['./package.json']),
    ignore: z.array(z.string()).optional(),
    extends: z.string().optional(),
    rules: z
      .object({
        order: z.array(z.string()).default(PackageJSONSchema.keyof().options),
        merge: z.record(z.any()).optional(),
      })
      .default({}),
  })
  .default({});

export type ConfigType = z.infer<typeof ConfigSchema>;
export const DefaultConfig = ConfigSchema.parse({});
