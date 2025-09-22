const baseConfig = require("ilib-common-config/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-box",
        color: "yellow",
    },
};

module.exports = config;
