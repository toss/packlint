import { z, ZodError } from 'zod';

export const PackageJSONErrorMap: z.ZodErrorMap = issue => {
  switch (issue.code) {
    case 'invalid_type':
      return {
        message: `Field [${issue.path.join('][')}] is exepected to be a type of '${issue.expected}', but is '${
          issue.received
        }'.`,
      };
    default:
      return {
        message: `Field [${issue.path.join(
          ']['
        )}] is invalid. see https://docs.npmjs.com/cli/v8/configuring-npm/package-json`,
      };
  }
};

export function parseZodError(e: ZodError) {
  return (JSON.parse(e.message)[0] as ZodError).message;
}

export function isZodError(e: unknown): e is ZodError {
  return e instanceof ZodError;
}

z.setErrorMap(PackageJSONErrorMap);
