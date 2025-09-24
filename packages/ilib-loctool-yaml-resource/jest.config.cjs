const { jestConfig: baseConfig } = require("ilib-internal");

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-yaml-resource",
        color: "cyan",
    },
};

module.exports = config;
