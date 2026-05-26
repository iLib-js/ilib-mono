const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: 'ilib-address',
        color: 'cyan'
    }
};

module.exports = config;
