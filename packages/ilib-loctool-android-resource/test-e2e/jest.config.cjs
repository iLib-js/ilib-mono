const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-resource e2e",
        color: "gray",
    },
};

module.exports = config;
