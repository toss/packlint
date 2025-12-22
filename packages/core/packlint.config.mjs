export default {
  extends: '../../packlint.config.mjs',
  rules: {
    merge: {
      scripts: {
        build: 'tsdown',
      },
    },
  },
};
