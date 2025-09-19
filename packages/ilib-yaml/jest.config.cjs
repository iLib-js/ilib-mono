const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-yaml",
        color: "yellowBright",
    }
}


module.exports = config;

