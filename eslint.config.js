const js = require('@eslint/js');

const browserGlobals = {
  window: 'readonly', document: 'readonly', localStorage: 'readonly', location: 'readonly',
  history: 'readonly', URLSearchParams: 'readonly', setTimeout: 'readonly',
  module: 'writable', globalThis: 'readonly'
};

module.exports = [
  js.configs.recommended,
  {
    files: ['site/js/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: browserGlobals },
    rules: { 'no-unused-vars': ['error', { caughtErrors: 'none' }] }
  },
  {
    files: ['tests/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022, sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable', __dirname: 'readonly', console: 'readonly', process: 'readonly' }
    }
  }
];
