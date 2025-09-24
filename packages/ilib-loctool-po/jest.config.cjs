const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-po",
        color: "blueBright",
    },
};

module.exports = config;
