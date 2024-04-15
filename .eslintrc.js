module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
      },
    ],
    'no-use-before-define': 'off',
    'react/prop-types': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-void': ['error', { allowAsStatement: true }],
    'global-require': 'off',
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
};
