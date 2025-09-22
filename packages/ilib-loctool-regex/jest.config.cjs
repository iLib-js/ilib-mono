const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-regex",
        color: "cyanBright",
    },
};

module.exports = config;
