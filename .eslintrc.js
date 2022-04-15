module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint-config-tencent',
    'eslint-config-tencent/ts',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-multi-spaces': 'error',
    'jsx-quotes': ['error', 'prefer-double'],

    'react/prop-types': 0,
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s',
        '**/tests/unit/**/*.spec.{j,t}s',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
