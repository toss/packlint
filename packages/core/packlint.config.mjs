// eslint-disable-next-line import/no-default-export
export default {
  extends: '../../packlint.config.mjs',
  rules: {
    merge: {
      scripts: {
        build: 'rm -rf dist && tsup ./src/index.ts ./src/testing/index.ts --format esm --dts',
      },
    },
  },
};
