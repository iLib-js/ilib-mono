const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-layout",
        color: "whiteBright",
    },
};

module.exports = config;
