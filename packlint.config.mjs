// eslint-disable-next-line import/no-default-export
export default {
  files: ['./packages/**/package.json'],
  ignore: ['./package.json'],
  rules: {
    merge: {
      type: 'module',
      exports: {
        '.': {
          types: './dist/index.d.ts',
          default: './dist/index.js',
        },
        './package.json': './package.json',
      },
      main: './dist/index.js',
      scripts: {
        prepack: 'yarn build',
        build: 'rm -rf dist && tsup ./src/index.ts --format esm --dts',
        dev: 'yarn run build --watch',
        typecheck: 'tsc --noEmit',
      },
      devDependencies: {
        tsup: '^6.5.0',
        typescript: '^5.9.3',
        vite: '^4.0.2',
        vitest: '^0.26.1',
      },
      publishConfig: {
        access: 'public',
      },
    },
  },
};
