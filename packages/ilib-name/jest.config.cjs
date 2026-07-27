const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-name",
        color: "blueBright",
    },
};

module.exports = config;
