const baseConfig = require("ilib-internal").jestEsmConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint-common",
        color: "magentaBright",
    },
};

module.exports = config;
