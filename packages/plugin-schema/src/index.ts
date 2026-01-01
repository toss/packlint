import type { Plugin } from '@packlint/core';
import type { StandardSchemaV1 } from '@standard-schema/spec';

export const schemaPlugin = (schema: StandardSchemaV1): Plugin => {
  return {
    name: 'packlint:schema',
    async check({ packageJson }) {
      const result = await schema['~standard'].validate(packageJson);

      if (result.issues && result.issues.length > 0) {
        return result.issues.map(issue => ({
          code: 'schema-error',
          message: issue.message,
        }));
      }

      return [];
    },
  };
};
