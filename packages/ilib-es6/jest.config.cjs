const { jestEsmConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-es6",
        color: "blueBright",
    }
}


module.exports = config;

