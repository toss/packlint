import { z } from 'zod';

import { ExportsSchema } from './Exports';
import { PackageJSONErrorMap } from './PackageJSONError';
import { PersonSchema } from './Person';

export const PackageJSONSchema = z
  .object(
    {
      name: z.string(),
      version: z.string(),
      packlint: z.boolean(),
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
      packageManager: z.string().describe('Experimental: https://nodejs.org/api/packages.html#packagemanager'),
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
              '*': z.array(z.string()).optional(),
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
          postpublish: z.string(),
          preinstall: z.string(),
          install: z.string(),
          postinstall: z.string(),
          preuninstall: z.string(),
          uninstall: z.string(),
          postuninstall: z.string(),
          preversion: z.string(),
          version: z.string(),
          postversion: z.string(),
          pretest: z.string(),
          test: z.string(),
          posttest: z.string(),
          prestop: z.string(),
          stop: z.string(),
          poststop: z.string(),
          prestart: z.string(),
          start: z.string(),
          poststart: z.string(),
          prerestart: z.string(),
          restart: z.string(),
          postrestart: z.string(),
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
