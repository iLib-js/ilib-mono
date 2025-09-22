const baseConfig = require("ilib-common-config/jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-resource",
        color: "black",
    },
};

module.exports = config;
