const { tsJestConfig: baseConfig } = require("ilib-common-config");

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

