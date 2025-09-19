const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-data-utils",
        color: "greenBright",
    }
}


module.exports = config;

