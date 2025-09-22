const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-jst",
        color: "blackBright",
    },
};

module.exports = config;
