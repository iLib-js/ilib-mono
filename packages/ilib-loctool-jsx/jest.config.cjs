const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-jsx",
        color: "greenBright",
    },
};

module.exports = config;
