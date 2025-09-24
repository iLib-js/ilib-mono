const { jestEsmConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-assemble",
        color: "cyan",
    },
};

module.exports = config;
