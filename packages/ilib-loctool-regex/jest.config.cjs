const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-regex",
        color: "cyanBright",
    },
};

module.exports = config;
