const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-android-layout",
        color: "whiteBright",
    }
}


module.exports = config;

