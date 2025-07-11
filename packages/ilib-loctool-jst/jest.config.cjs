const baseConfig = require("../../jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-jst",
        color: "blackBright",
    },
};

module.exports = config;
