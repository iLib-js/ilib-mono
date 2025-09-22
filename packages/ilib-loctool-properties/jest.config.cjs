const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-properties",
        color: "magentaBright",
    },
};

module.exports = config;
