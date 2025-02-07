const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "loctool",
        color: "blueBright",
    },
    "testPathIgnorePatterns": ["/tools/", "/node_modules/"],
    "globalSetup": "./test/setupTests.js"
}


module.exports = config;

