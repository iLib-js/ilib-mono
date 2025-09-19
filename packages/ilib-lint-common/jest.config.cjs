const { jestEsmConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-common",
        color: "magentaBright",
    }
}


module.exports = config;

