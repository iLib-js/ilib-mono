const { jestEsmConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-python",
        color: "yellow",
    },
};

module.exports = config;
