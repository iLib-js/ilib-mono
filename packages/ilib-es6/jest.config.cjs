const baseConfig = require("ilib-internal").jestEsmConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-es6",
        color: "blueBright",
    },
};

module.exports = config;
