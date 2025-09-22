const baseConfig = require("ilib-internal/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-resource",
        color: "black",
    },
};

module.exports = config;
