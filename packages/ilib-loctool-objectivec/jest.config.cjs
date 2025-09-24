const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-objectivec",
        color: "greenBright",
    },
};

module.exports = config;
