const baseConfig = require("ilib-internal").jestEsmConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-box",
        color: "yellow",
    },
};

module.exports = config;
