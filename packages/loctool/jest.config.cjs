const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "loctool",
        color: "blueBright",
    },
    testPathIgnorePatterns: ["/tools/", "/node_modules/", "/tstests/"],
    modulePathIgnorePatterns: ["/tstests/"],
    globalSetup: "./test/setupTests.js",
};

module.exports = config;
