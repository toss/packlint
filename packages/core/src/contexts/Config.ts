import { z } from 'zod';

import { PackageJSONSchema } from '../models/PackageJSON';

export const DEFAULT_ORDER = PackageJSONSchema.keyof().options;

export const ConfigSchema = z.object({
  order: z
    .array(z.union([PackageJSONSchema.keyof(), z.literal('...')]))
    .default(PackageJSONSchema.keyof().options)
    .optional(),
  deep: z
    .array(PackageJSONSchema.keyof())
    .default(['dependencies', 'devDependencies', 'peerDependencies', 'resolutions'])
    .optional(),
  required: z.array(PackageJSONSchema.keyof()).default(['name']).optional(),
});

export type ConfigType = z.infer<typeof ConfigSchema>;
export const DefaultConfig = ConfigSchema.parse({});
