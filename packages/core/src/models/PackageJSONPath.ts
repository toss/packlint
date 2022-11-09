import { readJSON } from 'fs-extra';
import { z } from 'zod';

import { PackageJSONSchema } from './PackageJSON';

export const PackageJSONPathSchema = z
  .string()
  .default(process.cwd())
  .transform(s => {
    if (s.endsWith('package.json')) {
      return s;
    }

    if (s.endsWith('/')) {
      return `${s}package.json`;
    }

    return `${s}/package.json`;
  });

export const PackageJSONFromPathSchema = z
  .string()
  .transform(PackageJSONPathSchema.parse)
  .transform(x => readJSON(x).then(PackageJSONSchema.parse));
