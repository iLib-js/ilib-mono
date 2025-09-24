const baseConfig = require("ilib-internal").jestEsmConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-assemble",
        color: "cyan",
    },
};

module.exports = config;
