const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "ilib-lint-box",
        color: "yellow",
    },
};

module.exports = config;
