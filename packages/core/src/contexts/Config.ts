import { z } from 'zod';

import { PackageJSONSchema } from '../models/PackageJSON';

export const DEFAULT_ORDER = PackageJSONSchema.keyof().options;

export const ConfigSchema = z
  .object({
    order: z
      .array(z.union([PackageJSONSchema.keyof(), z.literal('...')]))
      .default(PackageJSONSchema.keyof().options)
      .optional(),
    deep: z
      .array(PackageJSONSchema.keyof())
      .default(['dependencies', 'devDependencies', 'peerDependencies', 'resolutions'])
      .optional(),
    required: z.array(PackageJSONSchema.keyof()).default(['name']).optional(),
    replace: PackageJSONSchema.optional(),
    merge: PackageJSONSchema.optional(),
    include: z.array(z.string()).default(['./packages/**']).optional(),
    exclude: z.array(z.string()).default(['./packages/**']).optional(),
  })
  .default({});

export type ConfigType = z.infer<typeof ConfigSchema>;
export const DefaultConfig = ConfigSchema.parse({});
