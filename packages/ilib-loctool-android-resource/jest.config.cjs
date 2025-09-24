const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-resource",
        color: "black",
    },
};

module.exports = config;
