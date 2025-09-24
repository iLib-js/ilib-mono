const baseConfig = require("ilib-internal").jestEsmConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "tmxtool",
        color: "magentaBright",
    },
};

module.exports = config;
