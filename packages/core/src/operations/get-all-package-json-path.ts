import fg from 'fast-glob';

export async function getAllPackageJSONPath() {
  return fg(['./**/package.json'], {
    ignore: ['node_modules/**'],
  });
}

getAllPackageJSONPath.sync = function () {
  return fg.sync(['./**/package.json'], {
    ignore: ['node_modules/**'],
  });
};
