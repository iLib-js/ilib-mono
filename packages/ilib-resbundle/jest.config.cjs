const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "ilib-resbundle",
        color: "greenBright",
    },
};

module.exports = config;
