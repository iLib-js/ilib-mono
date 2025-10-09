const { jestEsmConfig } = require("ilib-internal");

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "tmxtool",
        color: "magentaBright",
    },
};

module.exports = config;
