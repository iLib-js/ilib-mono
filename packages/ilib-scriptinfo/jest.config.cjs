const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-scriptinfo",
        color: "blackBright",
    },
    preset: undefined,
    transform: {},
}

module.exports = config; 