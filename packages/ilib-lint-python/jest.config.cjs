const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "ilib-lint-python",
        color: "yellow",
    },
};

module.exports = config;
