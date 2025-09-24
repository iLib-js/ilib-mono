const { jestEsmConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-python-gnu",
        color: "green",
    },
};

module.exports = config;
