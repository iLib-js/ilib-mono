const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-layout e2e",
        color: "blackBright",
    },
};

module.exports = config;
