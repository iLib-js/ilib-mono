const baseConfig = require("../ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tools-common",
        color: "blackBright",
    },
};

module.exports = config;
