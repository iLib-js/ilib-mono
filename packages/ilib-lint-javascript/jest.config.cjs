const { jestEsmConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-box",
        color: "yellow",
    },
}


module.exports = config;
