const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-java",
        color: "blue",
    },
}

module.exports = config; 