const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tmx",
        color: "backBright",
    },
};

module.exports = config;
