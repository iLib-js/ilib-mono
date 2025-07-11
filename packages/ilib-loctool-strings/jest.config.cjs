const baseConfig = require("../../jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-strings",
        color: "blackBright",
    },
};

module.exports = config;
