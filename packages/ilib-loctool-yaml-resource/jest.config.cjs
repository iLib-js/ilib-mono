const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-yaml-resource",
        color: "cyan",
    },
};

module.exports = config;
