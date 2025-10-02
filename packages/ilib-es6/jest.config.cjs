const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "ilib-es6",
        color: "blueBright",
    },
};

module.exports = config;
