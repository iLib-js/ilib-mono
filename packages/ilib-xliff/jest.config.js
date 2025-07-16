const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    testEnvironment: 'node',
    displayName: {
        name: 'ilib-xliff',
        color: 'magenta'
    }
};

module.exports = config;