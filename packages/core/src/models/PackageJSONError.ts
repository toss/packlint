import { z } from 'zod';

export const PackageJSONErrorMap: z.ZodErrorMap = issue => {
  return {
    message: `${issue.path.join(
      '.'
    )} must follow rules below.\nsee https://docs.npmjs.com/cli/v8/configuring-npm/package-json`,
  };
};

z.setErrorMap(PackageJSONErrorMap);
