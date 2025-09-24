const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-env",
        color: "yellowBright",
    },
};

module.exports = config;
