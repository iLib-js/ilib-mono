const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-yaml",
        color: "yellowBright",
    },
};

module.exports = config;
