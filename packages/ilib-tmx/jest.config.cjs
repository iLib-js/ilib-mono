const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tmx",
        color: "backBright",
    }
}


module.exports = config;

