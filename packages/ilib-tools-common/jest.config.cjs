const baseConfig = require("../../jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tools-common",
        color: "blackBright",
    },
};

module.exports = config;
