const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-python",
        color: "yellow",
    },
}


module.exports = config;
