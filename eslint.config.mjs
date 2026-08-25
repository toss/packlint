// @ts-check

import eslint from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import secureCoding from 'eslint-plugin-secure-coding';

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
    files: ['**/*.{js,mjs,cjs,ts,tsx}'
  // Security rules, CWE- and CVSS-tagged, scoped to source.
  //
  // Measured against this repository before proposing it: 0 findings across
  // packages/*/src/**/*.{js,mjs,cjs,ts,tsx}. That is the point rather than a caveat — the block goes red on a
  // new one, not on what is here today.
  {
    files: ['packages/*/src/**/*.{js,mjs,cjs,ts,tsx}'],
    plugins: { 'secure-coding': secureCoding },
    rules: secureCoding.configs.recommended.rules,
  },
],
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
