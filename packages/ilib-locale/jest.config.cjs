const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-locale",
        color: "cyanBright",
    },
};

module.exports = config;
