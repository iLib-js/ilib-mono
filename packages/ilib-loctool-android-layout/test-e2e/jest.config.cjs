const { jestE2eConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-layout e2e",
        color: "blackBright",
    },
};

module.exports = config;
