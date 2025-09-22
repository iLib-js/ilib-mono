const baseConfig = require("ilib-internal/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-es6",
        color: "blueBright",
    },
};

module.exports = config;
