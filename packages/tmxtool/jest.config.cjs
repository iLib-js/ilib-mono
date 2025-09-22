const baseConfig = require("ilib-internal/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "tmxtool",
        color: "magentaBright",
    },
};

module.exports = config;
