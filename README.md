# packlint

Organize and lint `package.json` files in monorepos.

## Install

```sh
npm install --save-dev packlint
```

or

```sh
yarn add --dev packlint
```

## Usage

```sh
packlint [path] [options]
```

- `path` (optional): path or glob pattern targeting `package.json` files.
- If `path` is omitted, `files` from config are used.

### Options

- `--fix`: apply available fixes and write files.
- `--cwd <cwd>`: working directory for glob resolution and config search.
- `--verbose`: print debug logs.
- `--config <config>`: explicit config file path.

## Configuration

Supported config file names:

- `packlint.config.ts`
- `packlint.config.js`
- `packlint.config.mjs`
- `packlint.config.cjs`
- `packlint.config.mts`
- `packlint.config.cts`

Example:

```ts
// packlint.config.ts
import { defineConfig } from 'packlint/config';

export default defineConfig({
  files: ['packages/**/package.json'],
  sort: true,
});
```

### Config fields

- `files?: string[]`
- `sort?: boolean | string[]`
  - `true`: use default order
  - `false`: disable built-in sort plugin
  - `string[]`: custom sort priority
- `plugins?: Plugin[]`

## Plugin

A plugin returns issues from `check`.
Each issue can provide an optional `fix` function.

```ts
import type { Plugin } from '@packlint/core';

const plugin: Plugin = {
  name: 'example',
  check({ packageJson, filepath }) {
    return [
      {
        code: 'example',
        message: `${filepath} is checked`,
        fix: current => ({ ...current, private: true }),
      },
    ];
  },
};
```
