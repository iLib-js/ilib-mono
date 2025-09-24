const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-android-layout",
        color: "whiteBright",
    },
};

module.exports = config;
