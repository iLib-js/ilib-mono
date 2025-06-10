const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-assemble",
        color: "cyan",
    }
}


module.exports = config;

