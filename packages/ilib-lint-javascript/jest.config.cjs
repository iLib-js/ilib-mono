const { jestEsmConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-box",
        color: "yellow",
    },
};

module.exports = config;
