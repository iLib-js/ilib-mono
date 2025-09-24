const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-resource",
        color: "black",
    },
};

module.exports = config;
