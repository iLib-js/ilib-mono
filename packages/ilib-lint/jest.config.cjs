const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint",
        color: "red",
    },
}


module.exports = config;
