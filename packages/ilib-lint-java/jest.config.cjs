const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "ilib-lint-java",
        color: "blue",
    },
};

module.exports = config;
