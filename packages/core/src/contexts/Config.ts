import { z } from 'zod';

import { PackageJSONSchema } from '../models/index.js';

export const DEFAULT_ORDER = PackageJSONSchema.keyof().options;

export const ConfigSchema = z
  .object({
    order: z.array(z.string()).default(PackageJSONSchema.keyof().options),
    deep: z
      .array(z.string())
      .default([
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'peerDependenciesMeta',
        'resolutions',
        'scripts',
      ]),
    required: z.array(z.string()).optional(),
    replace: z.record(z.any()).optional(),
    merge: z.record(z.any()).optional(),
    include: z.array(z.string()).optional(),
    exclude: z.array(z.string()).optional(),
  })
  .default({});

export type ConfigType = z.infer<typeof ConfigSchema>;
export const DefaultConfig = ConfigSchema.parse({});
