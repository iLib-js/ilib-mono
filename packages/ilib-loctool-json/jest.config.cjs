const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-json",
        color: "blackBright",
    },
};

module.exports = config;
