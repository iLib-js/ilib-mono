const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-jst",
        color: "blackBright",
    },
};

module.exports = config;
