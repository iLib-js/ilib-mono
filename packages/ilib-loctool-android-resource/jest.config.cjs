const { jestConfig } = require("ilib-internal");

const config = {
    ...jestConfig,
    displayName: {
        name: "ilib-loctool-android-resource",
        color: "black",
    },
};

module.exports = config;
