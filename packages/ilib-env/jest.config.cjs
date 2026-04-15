const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-env",
        color: "yellowBright",
    },
};

module.exports = config;
