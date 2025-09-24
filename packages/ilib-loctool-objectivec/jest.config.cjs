const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-objectivec",
        color: "greenBright",
    },
};

module.exports = config;
