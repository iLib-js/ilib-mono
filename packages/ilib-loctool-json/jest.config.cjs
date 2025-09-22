const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-json",
        color: "blackBright",
    },
};

module.exports = config;
