const { jestEsmConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "tmxtool",
        color: "magentaBright",
    },
};

module.exports = config;
