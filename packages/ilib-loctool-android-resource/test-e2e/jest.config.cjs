const { jestE2eConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-resource e2e",
        color: "gray",
    },
};

module.exports = config;
