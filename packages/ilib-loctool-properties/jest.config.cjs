const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-properties",
        color: "magentaBright",
    },
};

module.exports = config;
