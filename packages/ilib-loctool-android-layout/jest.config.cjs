const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-layout",
        color: "whiteBright",
    },
};

module.exports = config;
