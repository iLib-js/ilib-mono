const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-data-utils",
        color: "greenBright",
    },
};

module.exports = config;
