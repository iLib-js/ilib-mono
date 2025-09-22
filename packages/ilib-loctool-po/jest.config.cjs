const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-po",
        color: "blueBright",
    },
};

module.exports = config;
