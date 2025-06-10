const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-common",
        color: "magentaBright",
    }
}


module.exports = config;

