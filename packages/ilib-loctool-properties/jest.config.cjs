const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-properties",
        color: "magentaBright",
    },
};

module.exports = config;
