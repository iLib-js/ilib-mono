const { jestE2eConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-resource e2e",
        color: "gray",
    },
};

module.exports = config;
