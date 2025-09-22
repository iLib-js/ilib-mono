const baseConfig = require("ilib-internal/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-box",
        color: "yellow",
    },
};

module.exports = config;
