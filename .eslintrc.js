require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['relekang', 'relekang/configs/typescript', 'relekang/configs/jest'],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
  },
  settings: {
    'eslint-config-relekang': {
      babel: true,
      typescript: true,
      react: false,
      jest: true,
    },
  },
  overrides: [
    {
      files: ['test/**'],
      rules: {
        'no-useless-escape': 'off',
      },
    },
    {
      files: ['test/fixtures/dummy.js'],
      rules: {
        'prettier/prettier': 'off',
        semi: ['error', 'never'],
      },
    },
  ],
};
