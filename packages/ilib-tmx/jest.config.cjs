const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tmx",
        color: "backBright",
    },
};

module.exports = config;
