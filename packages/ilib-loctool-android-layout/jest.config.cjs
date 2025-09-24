const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-layout",
        color: "whiteBright",
    },
};

module.exports = config;
