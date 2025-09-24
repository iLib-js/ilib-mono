const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-strings",
        color: "blackBright",
    },
};

module.exports = config;
