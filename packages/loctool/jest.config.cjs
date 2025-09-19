const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "loctool",
        color: "blueBright",
    },
    "testPathIgnorePatterns": ["/tools/", "/node_modules/", "/tstests/"],
    "modulePathIgnorePatterns": ["/tstests/"],
    "globalSetup": "./test/setupTests.js"
}

module.exports = config;

