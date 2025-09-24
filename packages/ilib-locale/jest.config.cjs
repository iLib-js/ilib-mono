const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-locale",
        color: "cyanBright",
    },
};

module.exports = config;
