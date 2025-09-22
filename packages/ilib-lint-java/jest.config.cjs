const baseConfig = require("ilib-internal/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-java",
        color: "blue",
    },
};

module.exports = config;
