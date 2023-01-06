# packlint

> Organize `package.json` in a large monorepo.

## Install

```sh
npm install --dev packlint
```

or with yarn

```sh
yarn install --dev packlint
```

## Usage

Packlint has two main features now.
Sort package.json in custom order (or recommended order by default).
Add or modify fields by applying merge rule. (ex: if you want to change build script of all packages in your large monorepo)

```
  Usage
    $ packlint

  Options
    --recursive,-R            Apply packlint to all sub-packages in repo recursively

  Commands
    (default)                 Apply all rules in config
    merge                     Apply merge rules in config
    sort                      Apply order rules in config

  Examples
    $ packlint
    $ packlint -R
    $ packlint merge
    $ packlint merge -R
    $ packlint sort
    $ packlint sort -R
```

## Configuration

The Packlint configuration file is named `packlint.config.mjs`. It should be placed in the root directory of your project and `default export` configuration object. For example:

```js
// packlint.config.mjs
export default {
  files: ['./packages/**/package.json'],
  ignore: ['./package.json'],
  rules: {
    merge: {
      type: 'module',
      scripts: {
        prepack: 'yarn build',
        build: 'rm -rf dist && tsup ./src/index.ts --format esm --dts',
        dev: 'yarn run build --watch',
        typecheck: 'tsc --noEmit',
      },
      publishConfig: {
        access: 'public',
      },
    },
  },
};
```

### Configuration Object

- `files` - An `array` of glob patterns indicating package.json that the configuration object should apply to. If not specified, default to `'./package.json'`.
- `ignores` - An `array` of glob patterns indicating the files that the configuration object should not apply to. If not specified, the configuration object applies to all files matched by files.
- `extends` - A path to the other configuration file. Only the rule will be extended and will be merge with [mergeDeepRight](https://ramdajs.com/docs/#mergeDeepRight) function.
- `rules` - An `object` containing the configured rules. When files or ignores are specified, these rule configurations are only available to the matching files.

  - `order` - An `array` of strings indicating the order of package.json keys. The `sort` command uses this rule to sort package.json by keys. If not specified, the recommended order will be applied by default.
  - `merge` - An `object` that is merged with package.json. The `merge` command uses [mergeDeepRight](https://ramdajs.com/docs/#mergeDeepRight) function, and the first object is package.json, and the second one is this object.

    >

    > Creates a new object with the own properties of the first object merged with the own properties of the second object. If a key exists in both objects:
    >
    > - and both values are objects, the two values will be recursively merged
    > - otherwise the value from the second object will be used.

### In Package.json

- If you set `packlint: false` in package.json, it will be ignored from applying packlint.
