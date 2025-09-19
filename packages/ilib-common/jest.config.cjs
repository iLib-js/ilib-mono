const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-common",
        color: "blackBright",
    }
}


module.exports = config;

