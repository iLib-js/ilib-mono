const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    testEnvironment: 'node',
    displayName: {
        name: 'ilib-xliff',
        color: 'magenta'
    }
};

module.exports = config;