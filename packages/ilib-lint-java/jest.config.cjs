const { jestEsmConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-java",
        color: "blue",
    },
}

module.exports = config; 