const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-yaml",
        color: "yellowBright",
    },
};

module.exports = config;
