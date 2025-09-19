const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-tools-common",
        color: "blackBright",
    },
};

module.exports = config;
