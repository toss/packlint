import { z } from 'zod';

export const PackageJSONErrorMap: z.ZodErrorMap = issue => {
  return {
    message: `Field [${issue.path.join(
      ']['
    )}] must follow these rules. see https://docs.npmjs.com/cli/v8/configuring-npm/package-json`,
  };
};

z.setErrorMap(PackageJSONErrorMap);
