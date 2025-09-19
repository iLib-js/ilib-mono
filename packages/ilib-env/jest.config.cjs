const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-env",
        color: "yellowBright",
    }
}


module.exports = config;

