const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tmx",
        color: "backBright",
    },
};

module.exports = config;
