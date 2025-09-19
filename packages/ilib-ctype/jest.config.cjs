const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-ctype",
        color: "blackBright",
    },
};

module.exports = config;
