const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-yaml",
        color: "magenta",
    },
};

module.exports = config;
