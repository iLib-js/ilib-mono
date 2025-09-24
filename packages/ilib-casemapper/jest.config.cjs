const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-casemapper",
        color: "white",
    },
};

module.exports = config;
