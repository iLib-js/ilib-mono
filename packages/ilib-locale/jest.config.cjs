const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-locale",
        color: "cyanBright",
    },
};

module.exports = config;
