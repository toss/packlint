// @ts-check

import eslint from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '.yarn/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json', './packages/**/tsconfig.json'],
      },
    },
    rules: {
      '@typescript-eslint/strict-boolean-expressions': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.es2026,
        ...globals.node,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      'import-x': importX,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
    },
  }
);
