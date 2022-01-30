require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['relekang', 'relekang/configs/flowtype'],
  parser: '@babel/eslint-parser',
  env: {
    node: true,
  },
  settings: {
    'eslint-config-relekang': {
      babel: true,
      typescript: false,
      react: false,
      jest: false,
    },
  },
  overrides: [{ files: ['test/**'], rules: { 'no-useless-escape': 'off' } }],
};
