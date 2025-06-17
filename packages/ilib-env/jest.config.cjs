const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-env",
        color: "yellowBright",
    }
}


module.exports = config;

