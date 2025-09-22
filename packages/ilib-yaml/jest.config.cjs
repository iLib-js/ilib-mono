const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-yaml",
        color: "yellowBright",
    },
};

module.exports = config;
