module.exports = {
  extends: [
    'standard-with-typescript'
  ],
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  plugins: [
    'prettier'
  ],
  settings: {
    react: {
      pragma: 'h',
      version: 'detect'
    }
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
   '@typescript-eslint/explicit-function-return-type': 'off'
  }
}
