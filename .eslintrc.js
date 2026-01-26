module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  plugins: ['unused-imports'],
  rules: {
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    'react/self-closing-comp': 'off',
    '@babel/no-unused-expressions': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'import/no-extraneous-dependencies': 0,
    'no-console': 0,
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',
    'react/no-array-index-key': 'off',
    'unused-imports/no-unused-imports': 'off',
  },
  // https://www.npmjs.com/package/@typescript-eslint/parser
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.*.json', './packages/**/tsconfig.json'],
  },
};
