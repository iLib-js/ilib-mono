const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-regex",
        color: "cyanBright",
    }
}


module.exports = config;

