const { tsJestConfig } = require('ilib-internal');

module.exports = {
  ...tsJestConfig,
  displayName: { name: 'ilib-csv', color: 'blackBright' },
  testMatch: ['**/test/**/*.test.ts'],
};
