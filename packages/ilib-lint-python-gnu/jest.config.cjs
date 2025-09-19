const { jestEsmConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-python-gnu",
        color: "green",
    },
}


module.exports = config;
