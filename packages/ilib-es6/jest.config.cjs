const { jestEsmConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-es6",
        color: "blueBright",
    },
};

module.exports = config;
