const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "ilib-lint-common",
        color: "magentaBright",
    },
};

module.exports = config;
