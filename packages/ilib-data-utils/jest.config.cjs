const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-data-utils",
        color: "greenBright",
    },
};

module.exports = config;
