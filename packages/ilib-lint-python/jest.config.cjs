const baseConfig = require("ilib-internal").jestEsmConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-python",
        color: "yellow",
    },
};

module.exports = config;
