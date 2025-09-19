const { jestEsmConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-lint",
        color: "blackBright",
    },
};

module.exports = config;
