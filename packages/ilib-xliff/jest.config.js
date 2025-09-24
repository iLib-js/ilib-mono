const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-xliff",
        color: "magenta",
    },
};

module.exports = config;
