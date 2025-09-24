const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-jst",
        color: "blackBright",
    },
};

module.exports = config;
