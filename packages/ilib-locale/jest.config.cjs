const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-locale",
        color: "cyanBright",
    }
}


module.exports = config;

