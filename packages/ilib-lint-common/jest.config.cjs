const { jestEsmConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-common",
        color: "magentaBright",
    },
};

module.exports = config;
