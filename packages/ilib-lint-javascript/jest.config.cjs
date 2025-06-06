const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-box",
        color: "yellow",
    },
}


module.exports = config;
