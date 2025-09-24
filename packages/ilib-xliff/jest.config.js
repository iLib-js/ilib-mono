const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-xliff",
        color: "magenta",
    },
};

module.exports = config;
