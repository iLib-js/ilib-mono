const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    testEnvironment: "node",
    displayName: {
        name: "ilib-localeinfo",
        color: "magenta",
    },
};

module.exports = config;
