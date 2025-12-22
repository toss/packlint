import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import jestPlugin from 'eslint-plugin-jest';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/esm/**', 'rollup.config.js', 'jest.config.js', '.yarn/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
  },
  {
    // Configure parser options ONLY for TypeScript files
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts', '**/*.tsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'import-x': importX,
      // Alias 'import' to 'import-x' for backward compatibility with eslint-disable comments
      import: importX,
      jest: jestPlugin,
    },
    rules: {
      //
      // eslint-plugin-import (now import-x)
      //

      // disallow non-import statements appearing before import statements
      'import-x/first': 'error',
      // Require a newline after the last import/require in a group
      'import-x/newline-after-import': 'error',
      // Forbid import of modules using absolute paths
      'import-x/no-absolute-path': 'error',
      // disallow AMD require/define
      'import-x/no-amd': 'error',
      // disallow imports from duplicate paths
      'import-x/no-duplicates': 'error',
      // Forbid the use of extraneous packages
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          peerDependencies: true,
          optionalDependencies: false,
        },
      ],
      // Forbid mutable exports
      'import-x/no-mutable-exports': 'error',
      // Prevent importing the default as if it were named
      'import-x/no-named-default': 'error',
      // Prohibit named exports
      'import-x/no-named-export': 'off', // we want everything to be a named export
      // Forbid a module from importing itself
      'import-x/no-self-import': 'error',
      // Require modules with a single export to use a default export
      'import-x/prefer-default-export': 'off', // we want everything to be named

      // enforce a sort order across the codebase
      'simple-import-sort/imports': 'error',
    },
  },
  {
    files: ['**/*.config.mjs', 'eslint.config.mjs'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  }
);
