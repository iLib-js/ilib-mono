const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-data-utils",
        color: "greenBright",
    },
};

module.exports = config;
