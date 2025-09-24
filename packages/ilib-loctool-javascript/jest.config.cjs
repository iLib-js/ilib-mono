const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-javascript",
        color: "cyan",
    },
};

module.exports = config;
