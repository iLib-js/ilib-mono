const baseConfig = require("ilib-internal/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-common",
        color: "magentaBright",
    },
};

module.exports = config;
