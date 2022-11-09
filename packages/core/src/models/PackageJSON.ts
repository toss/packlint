import { z } from 'zod';

import { REGEX } from '../utils/regex';
import { ExportsSchema } from './Exports';
import { PackageJSONErrorMap } from './PackageJSONError';
import { PersonSchema } from './Person';

export const PackageJSONSchema = z
  .object(
    {
      name: z.string().regex(REGEX.name),
      version: z.string().regex(REGEX.version),
      private: z.boolean(),
      description: z.string(),
      keywords: z.array(z.string()),
      homepage: z.string(),
      bugs: z.union([
        z.object({
          url: z.string().url().optional(),
          email: z.string().email().optional(),
        }),
        z.string(),
      ]),
      repository: z.union([
        z.object({
          type: z.string().optional(),
          url: z.string().url().optional(),
          directory: z.string().optional(),
        }),
        z.string(),
      ]),
      funding: z.union([
        z.object({ type: z.string(), url: z.string() }),
        z.string(),
        z.array(z.object({ type: z.string(), url: z.string() }), z.string()),
      ]),
      license: z.string(),
      author: z.union([PersonSchema, z.string()]),
      contributors: z.array(PersonSchema),
      sideEffects: z.boolean(),
      packageManager: z
        .string()
        .regex(REGEX.packageManager)
        .describe('Experimental: https://nodejs.org/api/packages.html#packagemanager'),
      type: z.enum(['commonjs', 'module']),
      exports: ExportsSchema,
      main: z.string(),
      module: z.string(),
      browser: z.string(),
      types: z.string().describe('Cummunity Defined: Typescript'),
      typings: z.string().describe('Cummunity Defined: Typescript'),
      typesVersions: z
        .record(
          z
            .object({
              '*': z.array(z.string().regex(REGEX.typesVersions)).optional(),
            })
            .strict()
        )
        .describe('Cummunity Defined: Typescript'),
      bin: z.union([z.string(), z.record(z.string())]),
      man: z.union([z.array(z.string()), z.string()]),
      directories: z.object({
        bin: z.string().optional(),
        doc: z.string().optional(),
        example: z.string().optional(),
        lib: z.string().optional(),
        man: z.string().optional(),
        test: z.string().optional(),
      }),
      files: z.array(z.string()),
      workspaces: z.union([
        z.array(z.string()),
        z.object({
          packages: z.array(z.string()).optional(),
          nohoist: z.array(z.string()).describe('Supported in Yarn only.').optional(),
        }),
      ]),
      scripts: z
        .object({
          lint: z.string(),
          prepublish: z.string(),
          prepare: z.string(),
          prepublishOnly: z.string(),
          prepack: z.string(),
          postpack: z.string(),
          publish: z.string(),
          postpublish: z.any(),
          preinstall: z.string(),
          install: z.any(),
          postinstall: z.any(),
          preuninstall: z.any(),
          uninstall: z.any(),
          postuninstall: z.string(),
          preversion: z.any(),
          version: z.any(),
          postversion: z.string(),
          pretest: z.any(),
          test: z.any(),
          posttest: z.any(),
          prestop: z.any(),
          stop: z.any(),
          poststop: z.any(),
          prestart: z.any(),
          start: z.any(),
          poststart: z.any(),
          prerestart: z.any(),
          restart: z.any(),
          postrestart: z.any(),
          serve: z.string(),
        })
        .partial()
        .catchall(z.string()),
      config: z.object({}).catchall(z.any()),
      dependencies: z.record(z.string()),
      devDependencies: z.record(z.string()),
      optionalDependencies: z.record(z.string()),
      peerDependencies: z.record(z.string()),
      peerDependenciesMeta: z.record(
        z.object({
          optional: z.boolean(),
        })
      ),
      bundledDependencies: z.union([z.array(z.string()), z.boolean()]),
      resolutions: z.record(z.string()).describe('Community Defined: Yarn'),
      engines: z.object({ node: z.string().optional() }).catchall(z.string()),
      os: z.array(z.string()),
      cpu: z.array(z.string()),
      publishConfig: z
        .object({
          access: z.enum(['public', 'restricted']).optional(),
          tag: z.string().optional(),
          registry: z.string().url().optional(),
          type: z.enum(['commonjs', 'module']),
          main: z.string(),
          browser: z.string(),
          module: z.string(),
          exports: ExportsSchema,
          bin: z.union([z.string(), z.record(z.string())]),
          types: z.string(),
          typings: z.string(),
        })
        .partial()
        .catchall(z.any()),
    },
    { errorMap: PackageJSONErrorMap }
  )
  .passthrough()
  .partial();

export type PackageJSONType = z.infer<typeof PackageJSONSchema>;
