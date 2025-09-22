const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-layout",
        color: "whiteBright",
    },
};

module.exports = config;
