const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "loctool",
        color: "blueBright",
    },
    testPathIgnorePatterns: ["/tools/", "/node_modules/", "/tstests/"],
    modulePathIgnorePatterns: ["/tstests/"],
    globalSetup: "./test/setupTests.js",
};

module.exports = config;
