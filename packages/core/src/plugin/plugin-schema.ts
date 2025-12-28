import type { StandardSchemaV1 } from '@standard-schema/spec';
import { createPlugin } from './create-plugin.js';

const PLUGIN_NAME = 'packlint:schema';

export const schemaPlugin = createPlugin((schema: StandardSchemaV1) => {
  return {
    name: PLUGIN_NAME,
    rules: [
      {
        name: `${PLUGIN_NAME}:invalid`,
        async check({ data, filepath }) {
          const result = await schema['~standard'].validate(data);

          if (result.issues && result.issues.length > 0) {
            return result.issues.map(issue => ({
              message: issue.message,
              filepath,
              fixable: false,
            }));
          }

          return [];
        },
      },
    ],
  };
});
