const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-python-gnu",
        color: "green",
    },
}


module.exports = config;
