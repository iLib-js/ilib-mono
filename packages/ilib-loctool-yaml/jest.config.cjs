const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-yaml",
        color: "magenta",
    },
};

module.exports = config;
