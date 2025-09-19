const { jestEsmConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "tmxtool",
        color: "magentaBright",
    }
}


module.exports = config;

