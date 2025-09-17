const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-json e2e",
        color: "blackBright",
    },
};

module.exports = config;
