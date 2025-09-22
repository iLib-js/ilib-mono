const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-ctype",
        color: "blackBright",
    },
};

module.exports = config;
