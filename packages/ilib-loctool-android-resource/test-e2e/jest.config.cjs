const { jestE2eConfig } = require("ilib-internal");

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "ilib-loctool-android-resource e2e",
        color: "gray",
    },
};

module.exports = config;
