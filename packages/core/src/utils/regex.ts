export const REGEX = {
  name: new RegExp('^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$'),
  version:
    /(?<=^v?|\sv?)(?:(?:0|[1-9]\d{0,9}?)\.){2}(?:0|[1-9]\d{0,9})(?:-(?:--+)?(?:0|[1-9]\d*|\d*[a-z]+\d*)){0,100}(?=$| |\+|\.)(?:(?<=-\S+)(?:\.(?:--?|[\da-z-]*[a-z-]\d*|0|[1-9]\d*)){1,100}?)?(?!\.)(?:\+(?:[\da-z]\.?-?){1,100}?(?!\w))?(?!\+)/gi,
  typesVersions: new RegExp('^[^*]*(?:\\*[^*]*)?$'),
  packageManager: new RegExp('(npm|pnpm|yarn)@\\d+\\.\\d+\\.\\d+(-.+)?'),
  packageExportsEntryPath: new RegExp('^.*'),
  packageExportsEntryProperties: new RegExp('^(?![\\.0-9]).*'),
};
