const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-env",
        color: "yellowBright",
    },
};

module.exports = config;
