import { schemaPlugin } from '@packlint/core/plugin';
import { defineConfig } from 'packlint/config';
import { z } from 'zod';

export default defineConfig({
  files: ['**/package.json'],
  sort: true,
  plugins: [
    schemaPlugin(
      z.object({
        name: z.string('name should exsist').min(1),
        scripts: z.object({
          typecheck: z.string('typecheck script should exsist').regex(/tsc --noEmit|turbo run typecheck/, {
            error: "typecheck script must include 'tsc --noEmit' or 'turbo run typecheck'",
          }),
        }),
      })
    ),
  ],
});
