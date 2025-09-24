const baseConfig = require("ilib-internal").jestConfig;

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-xml",
        color: "blue",
    },
};

module.exports = config;
