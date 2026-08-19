const { tsJestConfig } = require("ilib-internal");

const config = {
    ...tsJestConfig,
    displayName: {
        name: "mojito-sdk",
        color: "cyan",
    },
};

module.exports = config;
