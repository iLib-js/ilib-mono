const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "ilib-lint-python-gnu",
        color: "green",
    },
};

module.exports = config;
