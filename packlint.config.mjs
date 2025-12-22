export default {
  files: ['./packages/**/package.json'],
  ignore: ['./package.json'],
  rules: {
    merge: {
      type: 'module',
      exports: {
        '.': {
          types: './dist/index.d.mts',
          default: './dist/index.mjs',
        },
        './package.json': './package.json',
      },
      main: './dist/index.mjs',
      scripts: {
        prepack: 'yarn build',
        build: 'tsdown',
        dev: 'tsdown --watch',
        typecheck: 'tsc --noEmit',
      },
      devDependencies: {
        tsdown: '^0.18.2',
        typescript: '^5.9.3',
        vitest: '^4.0.16',
      },
      publishConfig: {
        access: 'public',
      },
    },
  },
};
