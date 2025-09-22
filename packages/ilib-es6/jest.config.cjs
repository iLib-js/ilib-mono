const baseConfig = require("ilib-common-config/jest-esm.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-es6",
        color: "blueBright",
    },
};

module.exports = config;
