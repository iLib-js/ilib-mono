const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tools-common",
        color: "blackBright",
    },
};

module.exports = config;
