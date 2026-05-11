const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    testEnvironment: 'node',
    displayName: {
        name: 'ilib-address',
        color: 'cyan'
    }
};

module.exports = config; 
