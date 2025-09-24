const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-csv",
        color: "blackBright",
    },
};

module.exports = config;
