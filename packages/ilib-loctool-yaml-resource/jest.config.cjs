const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-yaml-resource",
        color: "cyan",
    },
};

module.exports = config;
