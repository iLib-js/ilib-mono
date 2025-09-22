const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-regex",
        color: "cyanBright",
    },
};

module.exports = config;
