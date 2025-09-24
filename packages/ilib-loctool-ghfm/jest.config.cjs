const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-ghfm",
        color: "green",
    },
};

module.exports = config;
