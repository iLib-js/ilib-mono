const baseConfig = require("ilib-internal/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-assemble",
        color: "cyan",
    },
};

module.exports = config;
