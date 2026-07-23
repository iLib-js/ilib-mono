const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-xliff",
        color: "magenta",
    },
};

module.exports = config;
