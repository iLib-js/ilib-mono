const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-xliff",
        color: "magenta",
    },
};

module.exports = config;
