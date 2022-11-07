import { PackageJSONType } from '@packlint/core';

import { sortPackageJSON } from './sort-package-json';

const packageJSON: PackageJSONType = {
  name: 'name',
  dependencies: {},
  devDependencies: {},
  peerDependencies: {},
  version: '0.0.1',
  main: './dist/index.js',
  type: 'module',
};

describe('sortPackageJSON', () => {
  it('sorts package.json properties by default order', () => {
    const sorted = sortPackageJSON(packageJSON);
    expect(Object.keys(sorted)).toMatchInlineSnapshot(`
      [
        "name",
        "version",
        "type",
        "main",
        "dependencies",
        "devDependencies",
        "peerDependencies",
      ]
    `);
  });
  it('sorts package.json properties by named order', () => {
    const sorted = sortPackageJSON(packageJSON, { order: ['dependencies', 'devDependencies', 'peerDependencies'] });
    expect(Object.keys(sorted)).toMatchInlineSnapshot(`
      [
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "name",
        "version",
        "type",
        "main",
      ]
    `);
  });
  it('sorts package.json properties using ... syntax', () => {
    const sorted1 = sortPackageJSON(packageJSON, {
      order: ['...', 'dependencies', 'peerDependencies'],
    });
    expect(Object.keys(sorted1)).toMatchInlineSnapshot(`
      [
        "name",
        "version",
        "type",
        "main",
        "dependencies",
        "peerDependencies",
        "devDependencies",
      ]
    `);

    const sorted2 = sortPackageJSON(packageJSON, {
      order: ['version', 'main', '...', 'dependencies', 'peerDependencies'],
    });
    expect(Object.keys(sorted2)).toMatchInlineSnapshot(`
      [
        "version",
        "main",
        "name",
        "type",
        "dependencies",
        "peerDependencies",
        "devDependencies",
      ]
    `);

    const sorted3 = sortPackageJSON(packageJSON, {
      order: ['version', 'main', '...', 'dependencies', 'peerDependencies', 'devDependencies', '...', 'type'],
    });
    expect(Object.keys(sorted3)).toMatchInlineSnapshot(`
      [
        "version",
        "main",
        "name",
        "dependencies",
        "peerDependencies",
        "devDependencies",
        "type",
      ]
    `);
  });
});
