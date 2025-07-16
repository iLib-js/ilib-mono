const baseConfig = require("../../jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-ctype",
        color: "blackBright",
    },
};

module.exports = config;
