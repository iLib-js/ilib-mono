const baseConfig = require("ilib-internal").jestEsmConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-java",
        color: "blue",
    },
};

module.exports = config;
