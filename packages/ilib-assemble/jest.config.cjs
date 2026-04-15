const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "ilib-assemble",
        color: "cyan",
    },
};

module.exports = config;
