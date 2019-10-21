module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin,
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    '@typescript-eslint/explicit-member-accessibility': [{ accessibility: 'no-public' }],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/explicit-function-return-type': [{ allowExpressions: true }],
    '@typescript-eslint/indent': 'off',
  },
};
