const { jestConfig: baseConfig } = require("ilib-common-config");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-csv",
        color: "blackBright",
    },
};

module.exports = config;
